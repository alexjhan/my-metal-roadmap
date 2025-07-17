-- Migración de base de datos para MetalRoadmap
-- Ejecutar este script en el editor SQL de Supabase

-- Habilitar RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Tabla de roadmaps
CREATE TABLE IF NOT EXISTS roadmaps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  emoji TEXT DEFAULT '🔥',
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de nodos
CREATE TABLE IF NOT EXISTS nodes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  roadmap_id UUID REFERENCES roadmaps(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '📚',
  position_x INTEGER DEFAULT 0,
  position_y INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de recursos
CREATE TABLE IF NOT EXISTS resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  node_id UUID REFERENCES nodes(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('artículo', 'video', 'libro')),
  title TEXT NOT NULL,
  url TEXT,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de personalizaciones de roadmaps
CREATE TABLE IF NOT EXISTS roadmap_customizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  roadmap_type TEXT NOT NULL,
  node_positions JSONB DEFAULT '{}',
  user_notes JSONB DEFAULT '{}',
  custom_connections JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, roadmap_type)
);

-- Tabla de propuestas de edición
CREATE TABLE IF NOT EXISTS edit_proposals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  roadmap_type TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  changes JSONB NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'applied')),
  votes JSONB DEFAULT '[]',
  comments JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de votos en propuestas
CREATE TABLE IF NOT EXISTS proposal_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID REFERENCES edit_proposals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  vote TEXT NOT NULL CHECK (vote IN ('approve', 'reject')),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(proposal_id, user_id)
);

-- Tabla de comentarios en propuestas
CREATE TABLE IF NOT EXISTS proposal_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID REFERENCES edit_proposals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de versiones de roadmaps
CREATE TABLE IF NOT EXISTS roadmap_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  roadmap_type TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nodes JSONB NOT NULL,
  edges JSONB NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  total_votes INTEGER DEFAULT 0,
  up_votes INTEGER DEFAULT 0,
  down_votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de votos en versiones de roadmaps
CREATE TABLE IF NOT EXISTS roadmap_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  version_id UUID REFERENCES roadmap_versions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(version_id, user_id)
);

-- Tabla de progreso del usuario
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  roadmap_type TEXT NOT NULL,
  completed_nodes JSONB DEFAULT '[]',
  current_node TEXT,
  time_spent INTEGER DEFAULT 0,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  progress_percentage INTEGER DEFAULT 0,
  notes JSONB DEFAULT '{}',
  bookmarks JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, roadmap_type)
);

-- ===== NUEVA MIGRACIÓN: Agregar restricción UNIQUE a roadmap_versions =====
-- Esta migración asegura que cada usuario solo pueda tener una versión por roadmap

-- Agregar restricción UNIQUE para roadmap_versions
-- Esto reemplazará cualquier versión existente cuando se cree una nueva
ALTER TABLE roadmap_versions 
ADD CONSTRAINT roadmap_versions_user_roadmap_unique 
UNIQUE (user_id, roadmap_type);

-- Crear índice para mejorar el rendimiento de las consultas
CREATE INDEX IF NOT EXISTS idx_roadmap_versions_user_roadmap 
ON roadmap_versions (user_id, roadmap_type);

-- Comentario explicativo
COMMENT ON CONSTRAINT roadmap_versions_user_roadmap_unique ON roadmap_versions 
IS 'Restricción que asegura que cada usuario solo pueda tener una versión por roadmap. Las nuevas versiones reemplazarán las existentes.';

-- Políticas RLS para versiones de roadmaps
CREATE POLICY "Anyone can view public roadmap versions" ON roadmap_versions
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view their own versions" ON roadmap_versions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create versions" ON roadmap_versions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own versions" ON roadmap_versions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own versions" ON roadmap_versions
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para votos en versiones
CREATE POLICY "Anyone can view roadmap votes" ON roadmap_votes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can vote" ON roadmap_votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own votes" ON roadmap_votes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes" ON roadmap_votes
  FOR DELETE USING (auth.uid() = user_id);

-- Habilitar RLS en las nuevas tablas
ALTER TABLE roadmap_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_votes ENABLE ROW LEVEL SECURITY; 

-- Script de migración para agregar columnas de información del usuario a roadmap_versions
-- Ejecutar en el editor SQL de Supabase

-- Agregar columnas para información del usuario en roadmap_versions
ALTER TABLE roadmap_versions 
ADD COLUMN IF NOT EXISTS user_email TEXT,
ADD COLUMN IF NOT EXISTS user_name TEXT,
ADD COLUMN IF NOT EXISTS user_linkedin TEXT,
ADD COLUMN IF NOT EXISTS user_facebook TEXT,
ADD COLUMN IF NOT EXISTS user_metadata JSONB DEFAULT '{}';

-- Crear índice para mejorar el rendimiento de búsquedas por email
CREATE INDEX IF NOT EXISTS idx_roadmap_versions_user_email ON roadmap_versions(user_email);

-- Actualizar versiones existentes con información del usuario (si es posible)
-- Esto es opcional y solo se ejecutará si hay datos existentes
UPDATE roadmap_versions 
SET user_email = (
  SELECT email 
  FROM auth.users 
  WHERE auth.users.id = roadmap_versions.user_id
)
WHERE user_email IS NULL AND user_id IS NOT NULL;

-- Comentarios sobre las nuevas columnas
COMMENT ON COLUMN roadmap_versions.user_email IS 'Email del usuario que creó la versión';
COMMENT ON COLUMN roadmap_versions.user_name IS 'Nombre del usuario que creó la versión';
COMMENT ON COLUMN roadmap_versions.user_linkedin IS 'URL de LinkedIn del usuario';
COMMENT ON COLUMN roadmap_versions.user_facebook IS 'URL de Facebook del usuario';
COMMENT ON COLUMN roadmap_versions.user_metadata IS 'Metadatos adicionales del usuario (JSON)'; 