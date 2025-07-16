import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'placeholder_key'

// Verificar si las variables de entorno están configuradas
const isConfigured = process.env.REACT_APP_SUPABASE_URL && process.env.REACT_APP_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Funciones helper para roadmaps
export const roadmapService = {
  // Crear roadmap
  async createRoadmap(userId, roadmapData) {
    if (!isConfigured) {
      throw new Error('Supabase no está configurado. Por favor, configura las variables de entorno.');
    }
    
    const { data, error } = await supabase
      .from('roadmaps')
      .insert({
        user_id: userId,
        title: roadmapData.title,
        description: roadmapData.description,
        emoji: roadmapData.emoji,
        is_public: false
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Obtener roadmaps del usuario
  async getUserRoadmaps(userId) {
    if (!isConfigured) {
      throw new Error('Supabase no está configurado. Por favor, configura las variables de entorno.');
    }
    
    const { data, error } = await supabase
      .from('roadmaps')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Obtener roadmap público por ID
  async getPublicRoadmap(roadmapId) {
    if (!isConfigured) {
      throw new Error('Supabase no está configurado. Por favor, configura las variables de entorno.');
    }
    
    const { data, error } = await supabase
      .from('roadmaps')
      .select(`
        *,
        nodes (
          *,
          resources (*)
        )
      `)
      .eq('id', roadmapId)
      .eq('is_public', true)
      .single()

    if (error) throw error
    return data
  },

  // Obtener versiones existentes de roadmaps
  async getRoadmapVersions(roadmapType) {
    if (!isConfigured) {
      throw new Error('Supabase no está configurado. Por favor, configura las variables de entorno.');
    }
    
    const { data, error } = await supabase
      .from('roadmap_versions')
      .select(`
        *,
        user_id,
        created_at,
        description,
        is_public,
        total_votes,
        profiles:user_id(email)
      `)
      .eq('roadmap_type', roadmapType)
      .eq('is_public', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    
    // Extraer el email del perfil del usuario
    return data.map(version => ({
      ...version,
      user_email: version.profiles?.email || null
    }));
  },

  // Obtener versiones de roadmaps del usuario
  async getUserRoadmapVersions(userId, roadmapType = null) {
    if (!isConfigured) {
      throw new Error('Supabase no está configurado. Por favor, configura las variables de entorno.');
    }
    
    let query = supabase
      .from('roadmap_versions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (roadmapType) {
      query = query.eq('roadmap_type', roadmapType);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Guardar o actualizar versión de roadmap (una sola por usuario por roadmap)
  async saveRoadmapVersion(userId, roadmapType, nodes, edges, description = null) {
    if (!isConfigured) {
      throw new Error('Supabase no está configurado. Por favor, configura las variables de entorno.');
    }
    
    const { data, error } = await supabase
      .from('roadmap_versions')
      .upsert({
        roadmap_type: roadmapType,
        user_id: userId,
        nodes: nodes,
        edges: edges,
        description: description || `Versión guardada por usuario - ${new Date().toLocaleString()}`,
        is_public: true,
        total_votes: 0,
        up_votes: 0,
        down_votes: 0,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,roadmap_type', // Conflicto en la restricción UNIQUE
        ignoreDuplicates: false // Actualizar en lugar de ignorar
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Obtener la versión específica del usuario para un roadmap
  async getUserVersion(userId, roadmapType) {
    if (!isConfigured) {
      throw new Error('Supabase no está configurado. Por favor, configura las variables de entorno.');
    }
    
    const { data, error } = await supabase
      .from('roadmap_versions')
      .select(`
        *,
        profiles:user_id(email)
      `)
      .eq('user_id', userId)
      .eq('roadmap_type', roadmapType)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no encontrado
    
    if (data) {
      return {
        ...data,
        user_email: data.profiles?.email || null
      };
    }
    
    return null;
  },

  // Obtener la versión más reciente del usuario para un roadmap
  async getUserLatestVersion(userId, roadmapType) {
    if (!isConfigured) {
      throw new Error('Supabase no está configurado. Por favor, configura las variables de entorno.');
    }
    
    const { data, error } = await supabase
      .from('roadmap_versions')
      .select('*')
      .eq('user_id', userId)
      .eq('roadmap_type', roadmapType)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 = no encontrado
    return data || null
  },

  // Crear nodo
  async createNode(roadmapId, nodeData) {
    if (!isConfigured) {
      throw new Error('Supabase no está configurado. Por favor, configura las variables de entorno.');
    }
    
    const { data, error } = await supabase
      .from('nodes')
      .insert({
        roadmap_id: roadmapId,
        label: nodeData.label,
        description: nodeData.description,
        icon: nodeData.icon,
        position_x: nodeData.position_x || 0,
        position_y: nodeData.position_y || 0
      })
      .select()
      .single()

    if (error) throw error
    return data
  }
} 