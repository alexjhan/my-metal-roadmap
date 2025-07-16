-- Migración de base de datos para MetalRoadmap (CORREGIDO)
-- Ejecutar este script en el editor SQL de Supabase
-- NO modifica tablas del sistema de Supabase

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

-- ===== LIMPIAR DATOS DUPLICADOS Y AGREGAR RESTRICCIÓN UNIQUE =====
-- Primero, eliminar versiones duplicadas, manteniendo solo la más reciente por usuario/roadmap

-- Crear tabla temporal con las versiones más recientes
CREATE TEMP TABLE latest_versions AS
SELECT DISTINCT ON (user_id, roadmap_type) 
  id,
  user_id,
  roadmap_type,
  nodes,
  edges,
  description,
  is_public,
  total_votes,
  up_votes,
  down_votes,
  created_at,
  updated_at
FROM roadmap_versions
ORDER BY user_id, roadmap_type, created_at DESC;

-- Eliminar todas las versiones existentes
DELETE FROM roadmap_versions;

-- Reinsertar solo las versiones más recientes
INSERT INTO roadmap_versions (
  id, user_id, roadmap_type, nodes, edges, description, 
  is_public, total_votes, up_votes, down_votes, created_at, updated_at
)
SELECT 
  id, user_id, roadmap_type, nodes, edges, description,
  is_public, total_votes, up_votes, down_votes, created_at, updated_at
FROM latest_versions;

-- Agregar restricción UNIQUE para roadmap_versions
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
DROP POLICY IF EXISTS "Anyone can view public roadmap versions" ON roadmap_versions;
CREATE POLICY "Anyone can view public roadmap versions" ON roadmap_versions
  FOR SELECT USING (is_public = true);

DROP POLICY IF EXISTS "Users can view their own versions" ON roadmap_versions;
CREATE POLICY "Users can view their own versions" ON roadmap_versions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Authenticated users can create versions" ON roadmap_versions;
CREATE POLICY "Authenticated users can create versions" ON roadmap_versions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own versions" ON roadmap_versions;
CREATE POLICY "Users can update their own versions" ON roadmap_versions
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own versions" ON roadmap_versions;
CREATE POLICY "Users can delete their own versions" ON roadmap_versions
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para votos en versiones
DROP POLICY IF EXISTS "Anyone can view roadmap votes" ON roadmap_votes;
CREATE POLICY "Anyone can view roadmap votes" ON roadmap_votes
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can vote" ON roadmap_votes;
CREATE POLICY "Authenticated users can vote" ON roadmap_votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own votes" ON roadmap_votes;
CREATE POLICY "Users can update their own votes" ON roadmap_votes
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own votes" ON roadmap_votes;
CREATE POLICY "Users can delete their own votes" ON roadmap_votes
  FOR DELETE USING (auth.uid() = user_id);

-- Habilitar RLS en las tablas
ALTER TABLE roadmap_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_customizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE edit_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para roadmaps
DROP POLICY IF EXISTS "Users can view public roadmaps" ON roadmaps;
CREATE POLICY "Users can view public roadmaps" ON roadmaps
  FOR SELECT USING (is_public = true);

DROP POLICY IF EXISTS "Users can view their own roadmaps" ON roadmaps;
CREATE POLICY "Users can view their own roadmaps" ON roadmaps
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Authenticated users can create roadmaps" ON roadmaps;
CREATE POLICY "Authenticated users can create roadmaps" ON roadmaps
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own roadmaps" ON roadmaps;
CREATE POLICY "Users can update their own roadmaps" ON roadmaps
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own roadmaps" ON roadmaps;
CREATE POLICY "Users can delete their own roadmaps" ON roadmaps
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para user_progress
DROP POLICY IF EXISTS "Users can view their own progress" ON user_progress;
CREATE POLICY "Users can view their own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own progress" ON user_progress;
CREATE POLICY "Users can create their own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own progress" ON user_progress;
CREATE POLICY "Users can update their own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own progress" ON user_progress;
CREATE POLICY "Users can delete their own progress" ON user_progress
  FOR DELETE USING (auth.uid() = user_id);

-- Mensaje de confirmación
SELECT 'Migración completada exitosamente. Datos duplicados eliminados y restricción UNIQUE agregada.' as status; 