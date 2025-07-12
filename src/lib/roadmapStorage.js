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