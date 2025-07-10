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

### 7. Próximos pasos
- [ ] Visualizar roadmaps creados
- [ ] Compartir roadmaps públicos
- [ ] Editar roadmaps existentes
- [ ] Agregar recursos a los nodos
- [ ] Sistema de likes y comentarios 