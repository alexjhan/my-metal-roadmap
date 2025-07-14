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
        total_votes
      `)
      .eq('roadmap_type', roadmapType)
      .eq('is_public', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Obtener versión específica de roadmap
  async getRoadmapVersion(versionId) {
    if (!isConfigured) {
      throw new Error('Supabase no está configurado. Por favor, configura las variables de entorno.');
    }
    
    const { data, error } = await supabase
      .from('roadmap_versions')
      .select('*')
      .eq('id', versionId)
      .single()

    if (error) throw error
    return data
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