# Sistema de Versiones y Votación

## Descripción General

El sistema implementa un mecanismo completo de guardado, visualización pública y votación para los roadmaps de ingeniería metalúrgica. Los usuarios pueden editar roadmaps, guardar versiones públicas y votar por las mejores versiones.

## Funcionalidades Implementadas

### 1. Guardado de Versiones Públicas
- **Ubicación**: Los roadmaps editados se guardan en la tabla `roadmap_versions` de Supabase
- **Datos guardados**: 
  - Nodos y conexiones del roadmap
  - Metadatos (usuario, fecha, descripción)
  - Contadores de votos
- **Visibilidad**: Las versiones se marcan como públicas automáticamente

### 2. Visualización Pública
- **URLs**: `/roadmap/{tipo}/version/{id}` para ver versiones específicas
- **Datos mostrados**: 
  - Gráfico completo del roadmap editado
  - Información del autor y fecha
  - Estadísticas de votación
- **Modo solo lectura**: Las versiones se muestran sin opciones de edición

### 3. Sistema de Votación
- **Tipos de voto**: Positivo (👍) y Negativo (👎)
- **Restricciones**: Un usuario por voto por versión
- **Contadores**: Total de votos, votos positivos y negativos
- **Actualización en tiempo real**: Los contadores se actualizan inmediatamente

### 4. Versiones Mejor Votadas
- **Sección**: Debajo de cada roadmap público
- **Criterio**: Top 5 versiones ordenadas por total de votos
- **Información mostrada**:
  - Autor y fecha de la versión
  - Estadísticas de votación
  - Botones para votar
  - Enlace para ver la versión completa

## Estructura de Base de Datos

### Tabla `roadmap_versions`
```sql
CREATE TABLE roadmap_versions (
  id UUID PRIMARY KEY,
  roadmap_type TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
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
```

### Tabla `roadmap_votes`
```sql
CREATE TABLE roadmap_votes (
  id UUID PRIMARY KEY,
  version_id UUID REFERENCES roadmap_versions(id),
  user_id UUID REFERENCES auth.users(id),
  vote_type TEXT CHECK (vote_type IN ('up', 'down')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(version_id, user_id)
);
```

## Componentes Principales

### 1. `TopVersionsSection`
- **Ubicación**: `src/components/TopVersionsSection.js`
- **Función**: Muestra las 5 versiones mejor votadas
- **Características**:
  - Carga versiones públicas ordenadas por votos
  - Permite votar directamente desde la lista
  - Muestra estadísticas de votación
  - Enlaces a versiones específicas

### 2. `RoadmapVersionPage`
- **Ubicación**: `src/components/RoadmapVersionPage.js`
- **Función**: Muestra una versión específica de un roadmap
- **Características**:
  - Carga datos de la versión desde la BD
  - Muestra información del autor y fecha
  - Renderiza el gráfico en modo solo lectura
  - Estadísticas detalladas de votación

### 3. Editor Actualizado
- **Archivo**: `src/components/editor/EditRoadmapRefactored.js`
- **Cambios**:
  - Guardado directo en `roadmap_versions`
  - Versiones marcadas como públicas automáticamente
  - Notificaciones de guardado exitoso

## Flujo de Usuario

### 1. Edición y Guardado
1. Usuario accede al editor de un roadmap
2. Realiza modificaciones en nodos y conexiones
3. Hace clic en "Guardar"
4. Sistema guarda versión pública en la BD
5. Muestra notificación de éxito

### 2. Visualización Pública
1. Usuario visita un roadmap público
2. Ve la sección "Versiones Mejor Votadas"
3. Puede votar por versiones existentes
4. Puede hacer clic en "Ver Versión" para ver detalles

### 3. Votación
1. Usuario debe estar autenticado para votar
2. Puede votar positivo o negativo
3. Puede cambiar su voto o removerlo
4. Los contadores se actualizan en tiempo real

## Configuración Requerida

### 1. Base de Datos
Ejecutar el script `migrate_database.sql` en Supabase:
```bash
# Copiar el contenido de migrate_database.sql
# y ejecutarlo en el editor SQL de Supabase
```

### 2. Variables de Entorno
Asegurar que las variables de Supabase estén configuradas:
```env
REACT_APP_SUPABASE_URL=tu_url_de_supabase
REACT_APP_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
```

### 3. Rutas
Las nuevas rutas ya están configuradas en `App.js`:
- `/roadmap/:roadmapType/version/:versionId`

## Seguridad

### Políticas RLS Implementadas
- **Versiones**: Solo usuarios autenticados pueden crear, ver propias y públicas
- **Votos**: Solo usuarios autenticados pueden votar, ver todos los votos
- **Integridad**: Un voto por usuario por versión

### Validaciones
- Verificación de autenticación antes de votar
- Validación de tipos de voto (up/down)
- Verificación de existencia de versiones antes de mostrar

## Próximos Pasos

### Mejoras Sugeridas
1. **Sistema de comentarios** en versiones
2. **Filtros avanzados** (por fecha, autor, etc.)
3. **Notificaciones** cuando una versión recibe votos
4. **Sistema de badges** para versiones muy votadas
5. **Exportación** de versiones en diferentes formatos

### Optimizaciones
1. **Caché** de versiones populares
2. **Paginación** para listas largas de versiones
3. **Búsqueda** en versiones por contenido
4. **Compresión** de datos JSON para ahorrar espacio

## Estadísticas de Uso

### Estimación de Almacenamiento
- **Versión promedio**: ~50KB (nodos + conexiones)
- **100 versiones**: ~5MB
- **Límite Supabase**: 500MB
- **Margen disponible**: ~495MB

### Escalabilidad
- Sistema diseñado para manejar miles de versiones
- Votación optimizada con contadores pre-calculados
- Políticas RLS para seguridad a escala 