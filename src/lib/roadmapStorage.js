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
      .select('*')
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
  // Guardar roadmap en localStorage con compresión básica
  saveRoadmap: (roadmapType, nodes, edges) => {
    try {
      const roadmapData = {
        nodes: nodes,
        edges: edges,
        lastModified: new Date().toISOString(),
        version: '1.0'
      };

      // Comprimir datos antes de guardar
      const compressedData = JSON.stringify(roadmapData);
      const storageKey = `roadmap_${roadmapType}`;
      
      // Verificar si hay cambios antes de guardar
      const existingData = localStorage.getItem(storageKey);
      if (existingData === compressedData) {
        return; // No hay cambios, no guardar
      }

      localStorage.setItem(storageKey, compressedData);
      console.log(`Roadmap ${roadmapType} guardado en localStorage`);
    } catch (error) {
      console.error('Error guardando roadmap en localStorage:', error);
    }
  },

  // Cargar roadmap desde localStorage con validación
  loadRoadmap: (roadmapType) => {
    try {
      const storageKey = `roadmap_${roadmapType}`;
      const savedData = localStorage.getItem(storageKey);
      
      if (!savedData) {
        return null;
      }

      const roadmapData = JSON.parse(savedData);
      
      // Validar estructura de datos
      if (!roadmapData.nodes || !roadmapData.edges) {
        console.warn('Datos de roadmap corruptos, eliminando...');
        localStorage.removeItem(storageKey);
        return null;
      }

      console.log(`Roadmap ${roadmapType} cargado desde localStorage`);
      return roadmapData;
    } catch (error) {
      console.error('Error cargando roadmap desde localStorage:', error);
      // Limpiar datos corruptos
      const storageKey = `roadmap_${roadmapType}`;
      localStorage.removeItem(storageKey);
      return null;
    }
  },

  // Eliminar roadmap del localStorage
  deleteRoadmap: (roadmapType) => {
    try {
      const storageKey = `roadmap_${roadmapType}`;
      localStorage.removeItem(storageKey);
      console.log(`Roadmap ${roadmapType} eliminado de localStorage`);
    } catch (error) {
      console.error('Error eliminando roadmap de localStorage:', error);
    }
  },

  // Obtener lista de roadmaps guardados
  getSavedRoadmaps: () => {
    try {
      const savedRoadmaps = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('roadmap_')) {
          const roadmapType = key.replace('roadmap_', '');
          const data = localStorage.getItem(key);
          if (data) {
            try {
              const parsedData = JSON.parse(data);
              savedRoadmaps.push({
                type: roadmapType,
                lastModified: parsedData.lastModified,
                nodesCount: parsedData.nodes?.length || 0,
                edgesCount: parsedData.edges?.length || 0
              });
            } catch (e) {
              // Ignorar datos corruptos
              console.warn(`Datos corruptos para ${roadmapType}, eliminando...`);
              localStorage.removeItem(key);
            }
          }
        }
      }
      return savedRoadmaps;
    } catch (error) {
      console.error('Error obteniendo roadmaps guardados:', error);
      return [];
    }
  },

  // Limpiar roadmaps antiguos (más de 30 días)
  cleanupOldRoadmaps: () => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('roadmap_')) {
          const data = localStorage.getItem(key);
          if (data) {
            try {
              const parsedData = JSON.parse(data);
              const lastModified = new Date(parsedData.lastModified);
              
              if (lastModified < thirtyDaysAgo) {
                localStorage.removeItem(key);
                console.log(`Roadmap antiguo eliminado: ${key}`);
              }
            } catch (e) {
              // Eliminar datos corruptos
              localStorage.removeItem(key);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error limpiando roadmaps antiguos:', error);
    }
  },

  // Obtener estadísticas de almacenamiento
  getStorageStats: () => {
    try {
      const stats = {
        totalItems: 0,
        totalSize: 0,
        roadmaps: []
      };

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('roadmap_')) {
          const data = localStorage.getItem(key);
          if (data) {
            stats.totalItems++;
            stats.totalSize += data.length;
            
            const roadmapType = key.replace('roadmap_', '');
            stats.roadmaps.push({
              type: roadmapType,
              size: data.length
            });
          }
        }
      }

      return stats;
    } catch (error) {
      console.error('Error obteniendo estadísticas de almacenamiento:', error);
      return { totalItems: 0, totalSize: 0, roadmaps: [] };
    }
  }
};

// Sistema de seguimiento de progreso
export const progressService = {
  // Guardar progreso del usuario en un roadmap
  async saveProgress(userId, roadmapType, progressData) {
    const { data, error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        roadmap_type: roadmapType,
        completed_nodes: progressData.completedNodes || [],
        current_node: progressData.currentNode || null,
        time_spent: progressData.timeSpent || 0,
        last_accessed: new Date().toISOString(),
        progress_percentage: progressData.progressPercentage || 0,
        notes: progressData.notes || {},
        bookmarks: progressData.bookmarks || [],
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
    return data;
  },

  // Obtener progreso del usuario en un roadmap
  async getProgress(userId, roadmapType) {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('roadmap_type', roadmapType)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || {
      completed_nodes: [],
      current_node: null,
      time_spent: 0,
      progress_percentage: 0,
      notes: {},
      bookmarks: []
    };
  },

  // Obtener progreso general del usuario
  async getAllProgress(userId) {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .order('last_accessed', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Marcar nodo como completado
  async markNodeCompleted(userId, roadmapType, nodeId) {
    const currentProgress = await this.getProgress(userId, roadmapType);
    const completedNodes = [...new Set([...currentProgress.completed_nodes, nodeId])];
    
    return await this.saveProgress(userId, roadmapType, {
      ...currentProgress,
      completed_nodes: completedNodes,
      progress_percentage: this.calculateProgressPercentage(completedNodes, roadmapType)
    });
  },

  // Marcar nodo como no completado
  async markNodeIncomplete(userId, roadmapType, nodeId) {
    const currentProgress = await this.getProgress(userId, roadmapType);
    const completedNodes = currentProgress.completed_nodes.filter(id => id !== nodeId);
    
    return await this.saveProgress(userId, roadmapType, {
      ...currentProgress,
      completed_nodes: completedNodes,
      progress_percentage: this.calculateProgressPercentage(completedNodes, roadmapType)
    });
  },

  // Agregar nota a un nodo
  async addNodeNote(userId, roadmapType, nodeId, note) {
    const currentProgress = await this.getProgress(userId, roadmapType);
    const notes = { ...currentProgress.notes, [nodeId]: note };
    
    return await this.saveProgress(userId, roadmapType, {
      ...currentProgress,
      notes
    });
  },

  // Agregar bookmark
  async addBookmark(userId, roadmapType, nodeId) {
    const currentProgress = await this.getProgress(userId, roadmapType);
    const bookmarks = [...new Set([...currentProgress.bookmarks, nodeId])];
    
    return await this.saveProgress(userId, roadmapType, {
      ...currentProgress,
      bookmarks
    });
  },

  // Remover bookmark
  async removeBookmark(userId, roadmapType, nodeId) {
    const currentProgress = await this.getProgress(userId, roadmapType);
    const bookmarks = currentProgress.bookmarks.filter(id => id !== nodeId);
    
    return await this.saveProgress(userId, roadmapType, {
      ...currentProgress,
      bookmarks
    });
  },

  // Calcular porcentaje de progreso
  calculateProgressPercentage(completedNodes, roadmapType) {
    const roadmapData = staticRoadmaps[roadmapType];
    if (!roadmapData || !roadmapData.nodes) return 0;
    
    const totalNodes = roadmapData.nodes.length;
    return totalNodes > 0 ? Math.round((completedNodes.length / totalNodes) * 100) : 0;
  },

  // Obtener estadísticas de progreso
  async getProgressStats(userId) {
    const allProgress = await this.getAllProgress(userId);
    
    const stats = {
      totalRoadmaps: allProgress.length,
      completedRoadmaps: allProgress.filter(p => p.progress_percentage === 100).length,
      inProgressRoadmaps: allProgress.filter(p => p.progress_percentage > 0 && p.progress_percentage < 100).length,
      totalTimeSpent: allProgress.reduce((sum, p) => sum + (p.time_spent || 0), 0),
      averageProgress: allProgress.length > 0 
        ? Math.round(allProgress.reduce((sum, p) => sum + (p.progress_percentage || 0), 0) / allProgress.length)
        : 0,
      recentActivity: allProgress
        .sort((a, b) => new Date(b.last_accessed) - new Date(a.last_accessed))
        .slice(0, 5)
    };

    return stats;
  }
}; 