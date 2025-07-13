import { supabase } from './supabase';

// Datos estáticos de los roadmaps (no se guardan en BD)
export const staticRoadmaps = {
  'termodinamica': {
    title: 'Termodinámica',
    icon: '🔥',
    description: 'Ciencia que estudia las transformaciones de energía en sistemas físicos',
    nodes: [
      {
        id: 'termodinamica',
        label: 'Termodinámica',
        description: 'Ciencia que estudia las transformaciones de energía en sistemas físicos',
        icon: '🔥',
        position: { x: 0, y: 0 }
      },
      // ... más nodos
    ],
    edges: [
      // ... conexiones
    ]
  }
  // Agregar más roadmaps aquí
};

// Sistema de almacenamiento híbrido
export const roadmapStorage = {
  // Obtener roadmap completo (estático + personalizaciones)
  async getRoadmap(roadmapType, userId = null) {
    const staticData = staticRoadmaps[roadmapType];
    if (!staticData) {
      throw new Error(`Roadmap ${roadmapType} no encontrado`);
    }

    // Si no hay usuario, devolver datos estáticos
    if (!userId) {
      return staticData;
    }

    // Buscar personalizaciones del usuario
    const { data: customizations } = await supabase
      .from('roadmap_customizations')
      .select('*')
      .eq('user_id', userId)
      .eq('roadmap_type', roadmapType)
      .single();

    if (!customizations) {
      return staticData;
    }

    // Combinar datos estáticos con personalizaciones
    return this.mergeStaticWithCustomizations(staticData, customizations);
  },

  // Guardar personalizaciones del usuario
  async saveCustomizations(roadmapType, userId, customizations) {
    const { data, error } = await supabase
      .from('roadmap_customizations')
      .upsert({
        user_id: userId,
        roadmap_type: roadmapType,
        node_positions: customizations.nodePositions || {},
        user_notes: customizations.userNotes || {},
        custom_connections: customizations.customConnections || [],
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
    return data;
  },

  // Combinar datos estáticos con personalizaciones
  mergeStaticWithCustomizations(staticData, customizations) {
    const result = { ...staticData };

    // Aplicar posiciones personalizadas de nodos
    if (customizations.node_positions) {
      result.nodes = result.nodes.map(node => ({
        ...node,
        position: customizations.node_positions[node.id] || node.position
      }));
    }

    // Agregar conexiones personalizadas
    if (customizations.custom_connections) {
      result.edges = [...result.edges, ...customizations.custom_connections];
    }

    // Agregar notas del usuario
    if (customizations.user_notes) {
      result.userNotes = customizations.user_notes;
    }

    return result;
  },

  // Obtener solo las personalizaciones (para ahorrar espacio)
  async getUserCustomizations(roadmapType, userId) {
    const { data, error } = await supabase
      .from('roadmap_customizations')
      .select('*')
      .eq('user_id', userId)
      .eq('roadmap_type', roadmapType)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no encontrado
    return data || null;
  },

  // Eliminar personalizaciones (resetear a datos estáticos)
  async resetCustomizations(roadmapType, userId) {
    const { error } = await supabase
      .from('roadmap_customizations')
      .delete()
      .eq('user_id', userId)
      .eq('roadmap_type', roadmapType);

    if (error) throw error;
    return true;
  }
};

// Sistema de propuestas de edición
export const proposalService = {
  // Crear una nueva propuesta de edición
  async createProposal(roadmapType, userId, changes, description) {
    const { data, error } = await supabase
      .from('edit_proposals')
      .insert({
        roadmap_type: roadmapType,
        user_id: userId,
        changes: changes,
        description: description,
        status: 'pending',
        votes: [],
        comments: []
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Obtener propuestas de un roadmap
  async getProposals(roadmapType) {
    const { data, error } = await supabase
      .from('edit_proposals')
      .select(`
        *,
        votes(*),
        comments(*)
      `)
      .eq('roadmap_type', roadmapType)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Votar en una propuesta
  async voteOnProposal(proposalId, userId, vote, comment = '') {
    // Primero agregar el voto
    const { data: voteData, error: voteError } = await supabase
      .from('proposal_votes')
      .upsert({
        proposal_id: proposalId,
        user_id: userId,
        vote: vote,
        comment: comment
      })
      .select()
      .single();

    if (voteError) throw voteError;

    // Actualizar las estadísticas de la propuesta
    const { data: proposal, error: proposalError } = await supabase
      .from('edit_proposals')
      .select('votes')
      .eq('id', proposalId)
      .single();

    if (proposalError) throw proposalError;

    // Calcular si la propuesta debe ser aprobada o rechazada
    const totalVotes = proposal.votes.length;
    const approveVotes = proposal.votes.filter(v => v.vote === 'approve').length;
    const rejectVotes = proposal.votes.filter(v => v.vote === 'reject').length;

    let newStatus = 'pending';
    if (totalVotes >= 5) { // Mínimo 5 votos para decidir
      if (approveVotes > rejectVotes && approveVotes >= totalVotes * 0.6) {
        newStatus = 'approved';
      } else if (rejectVotes > approveVotes) {
        newStatus = 'rejected';
      }
    }

    // Actualizar el estado de la propuesta
    if (newStatus !== 'pending') {
      const { error: updateError } = await supabase
        .from('edit_proposals')
        .update({ status: newStatus })
        .eq('id', proposalId);

      if (updateError) throw updateError;
    }

    return voteData;
  },

  // Aplicar una propuesta aprobada
  async applyApprovedProposal(proposalId) {
    const { data: proposal, error } = await supabase
      .from('edit_proposals')
      .select('*')
      .eq('id', proposalId)
      .eq('status', 'approved')
      .single();

    if (error) throw error;

    // Aplicar los cambios al roadmap
    for (const change of proposal.changes) {
      if (change.type === 'node') {
        // Actualizar nodo
        await supabase
          .from('roadmap_customizations')
          .upsert({
            roadmap_type: proposal.roadmap_type,
            node_data: { [change.nodeId]: change.after }
          });
      } else if (change.type === 'connection') {
        // Actualizar conexiones
        await supabase
          .from('roadmap_customizations')
          .upsert({
            roadmap_type: proposal.roadmap_type,
            custom_connections: [change.after]
          });
      }
    }

    // Marcar la propuesta como aplicada
    await supabase
      .from('edit_proposals')
      .update({ status: 'applied' })
      .eq('id', proposalId);

    return proposal;
  }
};

// Estimación de uso de almacenamiento
export const storageEstimates = {
  // Datos estáticos (no cuentan contra límite de BD)
  staticData: {
    'termodinamica': '~5KB',
    'matematicas': '~4KB',
    'fisica': '~4KB',
    // 30 roadmaps = ~150KB (gratis)
  },

  // Datos dinámicos por usuario (cuentan contra límite)
  userData: {
    nodePositions: '~2KB por roadmap',
    userNotes: '~1KB por roadmap',
    customConnections: '~1KB por roadmap',
    // Total por usuario: ~4KB por roadmap
    // 100 usuarios × 30 roadmaps = ~12MB (dentro del límite de 500MB)
  }
};

// Funciones para guardar y cargar roadmaps
export const roadmapStorageService = {
  // Guardar roadmap en localStorage
  saveRoadmap: (roadmapType, nodes, edges) => {
    try {
      const roadmapData = {
        nodes: nodes,
        edges: edges,
        lastModified: new Date().toISOString(),
        version: '1.0'
      };
      localStorage.setItem(`roadmap_${roadmapType}`, JSON.stringify(roadmapData));
      console.log(`Roadmap ${roadmapType} guardado en localStorage`);
      return true;
    } catch (error) {
      console.error('Error guardando roadmap:', error);
      return false;
    }
  },

  // Cargar roadmap desde localStorage
  loadRoadmap: (roadmapType) => {
    try {
      const savedData = localStorage.getItem(`roadmap_${roadmapType}`);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        console.log(`Roadmap ${roadmapType} cargado desde localStorage`);
        return {
          nodes: parsedData.nodes || [],
          edges: parsedData.edges || [],
          lastModified: parsedData.lastModified,
          version: parsedData.version
        };
      }
      return null;
    } catch (error) {
      console.error('Error cargando roadmap:', error);
      return null;
    }
  },

  // Verificar si existe un roadmap guardado
  hasSavedRoadmap: (roadmapType) => {
    return localStorage.getItem(`roadmap_${roadmapType}`) !== null;
  },

  // Obtener todos los roadmaps guardados
  getAllSavedRoadmaps: () => {
    const savedRoadmaps = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('roadmap_')) {
        const roadmapType = key.replace('roadmap_', '');
        const savedData = roadmapStorageService.loadRoadmap(roadmapType);
        if (savedData) {
          savedRoadmaps[roadmapType] = savedData;
        }
      }
    }
    return savedRoadmaps;
  },

  // Eliminar roadmap guardado
  deleteRoadmap: (roadmapType) => {
    try {
      localStorage.removeItem(`roadmap_${roadmapType}`);
      console.log(`Roadmap ${roadmapType} eliminado de localStorage`);
      return true;
    } catch (error) {
      console.error('Error eliminando roadmap:', error);
      return false;
    }
  }
}; 