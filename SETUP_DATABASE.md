# 🗄️ Configuración de Base de Datos

## Pasos para configurar Supabase

### 1. Crear proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta gratuita
3. Crea un nuevo proyecto
4. Guarda la URL y la anon key

### 2. Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto:

```env
REACT_APP_SUPABASE_URL=tu_url_de_supabase
REACT_APP_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
```

### 3. Instalar dependencias
```bash
npm install @supabase/supabase-js
```

### 4. Crear tablas en Supabase
Ejecuta este SQL en el editor SQL de Supabase:

```sql
-- Habilitar RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Tabla de roadmaps
CREATE TABLE roadmaps (
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
CREATE TABLE nodes (
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
CREATE TABLE resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  node_id UUID REFERENCES nodes(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('artículo', 'video', 'libro')),
  title TEXT NOT NULL,
  url TEXT,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de personalizaciones de roadmaps (NUEVA)
CREATE TABLE roadmap_customizations (
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

-- Tabla de propuestas de edición (NUEVA)
CREATE TABLE edit_proposals (
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

-- Tabla de votos en propuestas (NUEVA)
CREATE TABLE proposal_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID REFERENCES edit_proposals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  vote TEXT NOT NULL CHECK (vote IN ('approve', 'reject')),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(proposal_id, user_id)
);

-- Tabla de comentarios en propuestas (NUEVA)
CREATE TABLE proposal_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID REFERENCES edit_proposals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de versiones de roadmaps (NUEVA)
CREATE TABLE roadmap_versions (
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

-- Tabla de votos en versiones de roadmaps (NUEVA)
CREATE TABLE roadmap_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  version_id UUID REFERENCES roadmap_versions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(version_id, user_id)
);

-- Políticas RLS para roadmaps
CREATE POLICY "Users can view their own roadmaps" ON roadmaps
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own roadmaps" ON roadmaps
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own roadmaps" ON roadmaps
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own roadmaps" ON roadmaps
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para nodos
CREATE POLICY "Users can view nodes of their roadmaps" ON nodes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM roadmaps 
      WHERE roadmaps.id = nodes.roadmap_id 
      AND roadmaps.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert nodes to their roadmaps" ON nodes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM roadmaps 
      WHERE roadmaps.id = nodes.roadmap_id 
      AND roadmaps.user_id = auth.uid()
    )
  );

-- Políticas RLS para recursos
CREATE POLICY "Users can view resources of their nodes" ON resources
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM nodes 
      JOIN roadmaps ON roadmaps.id = nodes.roadmap_id
      WHERE nodes.id = resources.node_id 
      AND roadmaps.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert resources to their nodes" ON resources
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM nodes 
      JOIN roadmaps ON roadmaps.id = nodes.roadmap_id
      WHERE nodes.id = resources.node_id 
      AND roadmaps.user_id = auth.uid()
    )
  );

-- Políticas RLS para personalizaciones (NUEVAS)
CREATE POLICY "Users can view their own customizations" ON roadmap_customizations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own customizations" ON roadmap_customizations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own customizations" ON roadmap_customizations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own customizations" ON roadmap_customizations
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para propuestas de edición (NUEVAS)
CREATE POLICY "Anyone can view proposals" ON edit_proposals
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create proposals" ON edit_proposals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Only proposal author can update" ON edit_proposals
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas RLS para votos en propuestas (NUEVAS)
CREATE POLICY "Anyone can view proposal votes" ON proposal_votes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can vote" ON proposal_votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own votes" ON proposal_votes
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas RLS para comentarios en propuestas (NUEVAS)
CREATE POLICY "Anyone can view proposal comments" ON proposal_comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can comment" ON proposal_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON proposal_comments
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas RLS para versiones de roadmaps (NUEVAS)
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

-- Políticas RLS para votos en versiones (NUEVAS)
CREATE POLICY "Anyone can view roadmap votes" ON roadmap_votes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can vote" ON roadmap_votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own votes" ON roadmap_votes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes" ON roadmap_votes
  FOR DELETE USING (auth.uid() = user_id);
```

### 5. Configurar Vercel
1. Ve a tu proyecto en Vercel
2. En Settings > Environment Variables
3. Agrega las mismas variables de entorno:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`

### 6. Funcionalidades implementadas
- ✅ Autenticación de usuarios
- ✅ Crear roadmaps personalizados
- ✅ Guardar nodos y conceptos
- ✅ Seguridad con RLS (Row Level Security)
- ✅ Integración con Vercel
- ✅ Sistema híbrido de almacenamiento (estático + personalizaciones)
- ✅ Optimización de espacio en base de datos

### 7. Próximos pasos
- [ ] Visualizar roadmaps creados
- [ ] Compartir roadmaps públicos
- [ ] Editar roadmaps existentes
- [ ] Agregar recursos a los nodos
- [ ] Sistema de likes y comentarios

### 8. Estimación de Uso de Almacenamiento

**Datos Estáticos (Gratis - no en BD):**
- 30 roadmaps = ~150KB
- Contenido base de todos los roadmaps

**Datos Dinámicos (en BD - cuenta contra límite):**
- Personalizaciones por usuario: ~4KB por roadmap
- 100 usuarios × 30 roadmaps = ~12MB
- **Límite de Supabase: 500MB**
- **Margen disponible: ~488MB**

**Optimizaciones implementadas:**
- ✅ Solo guardar cambios del usuario
- ✅ Datos base en archivos estáticos
- ✅ Comprimir posiciones y notas
- ✅ Eliminar redundancias 