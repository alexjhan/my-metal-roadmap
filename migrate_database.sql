-- Migración de base de datos para sistema de versiones y votación
-- Ejecutar este script en el editor SQL de Supabase

-- Habilitar RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

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