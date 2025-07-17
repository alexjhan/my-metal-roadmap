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
    
    console.log(`Consultando versiones para roadmap: ${roadmapType}`);
    
    const { data, error } = await supabase
      .from('roadmap_versions')
      .select('*')
      .eq('roadmap_type', roadmapType)
      .eq('is_public', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error(`Error consultando versiones para ${roadmapType}:`, error);
      throw error;
    }
    
    console.log(`Versiones encontradas para ${roadmapType}:`, data);
    
    // Por ahora, no obtenemos emails para evitar problemas de permisos
    const versionsWithEmail = data.map(version => ({
      ...version,
      user_email: null
    }));
    
    console.log(`Versiones procesadas para ${roadmapType}:`, versionsWithEmail);
    return versionsWithEmail;
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
  async saveRoadmapVersion(userId, roadmapType, nodes, edges, description = null, userInfo = null) {
    if (!isConfigured) {
      throw new Error('Supabase no está configurado. Por favor, configura las variables de entorno.');
    }
    
    console.log(`Guardando versión para usuario ${userId}, roadmap ${roadmapType}`);
    console.log('Datos a guardar:', { nodes: nodes.length, edges: edges.length, description });
    
    try {
      // Obtener información del usuario si no se proporciona
      let userData = userInfo;
      if (!userData) {
        const { data: user, error: userError } = await supabase.auth.getUser();
        if (!userError && user.user) {
          userData = {
            email: user.user.email,
            user_metadata: user.user.user_metadata || {}
          };
        }
      }
      
      // Preparar datos del usuario para guardar
      const userEmail = userData?.email || '';
      const userName = userData?.user_metadata?.full_name || 
                      userData?.user_metadata?.name || 
                      userData?.user_metadata?.display_name ||
                      userEmail?.split('@')[0] || '';
      const userLinkedIn = userData?.user_metadata?.linkedin_url || 
                          userData?.user_metadata?.linkedin || '';
      const userFacebook = userData?.user_metadata?.facebook_url || 
                          userData?.user_metadata?.facebook || '';    
      // Primero, verificar si ya existe una versión
      const existingVersion = await roadmapService.getUserVersion(userId, roadmapType);
      
      if (existingVersion) {
        console.log('Actualizando versión existente:', existingVersion.id);
        
        // Actualizar versión existente
        const { data, error } = await supabase
          .from('roadmap_versions')
          .update({
            nodes: nodes,
            edges: edges,
            description: description || existingVersion.description,
            user_email: userEmail,
            user_name: userName,
            user_linkedin: userLinkedIn,
            user_facebook: userFacebook,
            user_metadata: userData?.user_metadata || {},
            updated_at: new Date().toISOString()
          })
          .eq('id', existingVersion.id)
          .select()
          .single();

        if (error) {
          console.error('Error actualizando versión:', error);
          throw error;
        }
        
        console.log('Versión actualizada exitosamente:', data);
        return data;
      } else {
        console.log('Creando nueva versión');
        
        // Crear nueva versión
        const { data, error } = await supabase
          .from('roadmap_versions')
          .insert({
            roadmap_type: roadmapType,
            user_id: userId,
            nodes: nodes,
            edges: edges,
            description: description || `Versión guardada por usuario - ${new Date().toLocaleString()}`,
            user_email: userEmail,
            user_name: userName,
            user_linkedin: userLinkedIn,
            user_facebook: userFacebook,
            user_metadata: userData?.user_metadata || {},
            is_public: true,
            total_votes: 0,
            up_votes: 0,
            down_votes: 0
          })
          .select()
          .single();

        if (error) {
          console.error('Error creando versión:', error);
          throw error;
        }
        
        console.log('Nueva versión creada exitosamente:', data);
        return data;
      }
    } catch (error) {
      console.error('Error en saveRoadmapVersion:', error);
      throw error;
    }
  },

  // Obtener la versión específica del usuario para un roadmap
  async getUserVersion(userId, roadmapType) {
    if (!isConfigured) {
      throw new Error('Supabase no está configurado. Por favor, configura las variables de entorno.');
    }
    
    console.log(`Consultando versión del usuario ${userId} para roadmap: ${roadmapType}`);
    
    const { data, error } = await supabase
      .from('roadmap_versions')
      .select('*')
      .eq('user_id', userId)
      .eq('roadmap_type', roadmapType)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error(`Error consultando versión del usuario para ${roadmapType}:`, error);
      throw error;
    } // PGRST116 = no encontrado
    
    if (data) {
      const versionWithEmail = {
        ...data,
        user_email: null // Por ahora, no obtenemos email para evitar problemas de permisos
      };
      console.log(`Versión del usuario encontrada para ${roadmapType}:`, versionWithEmail);
      return versionWithEmail;
    }
    
    console.log(`No se encontró versión del usuario para ${roadmapType}`);
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