-- Script para aplicar restricción UNIQUE a roadmap_versions
-- Ejecutar este script en el editor SQL de Supabase

-- Verificar si la restricción ya existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'roadmap_versions_user_roadmap_unique'
        AND table_name = 'roadmap_versions'
    ) THEN
        -- Agregar restricción UNIQUE para roadmap_versions
        -- Esto asegura que cada usuario solo pueda tener una versión por roadmap
        ALTER TABLE roadmap_versions 
        ADD CONSTRAINT roadmap_versions_user_roadmap_unique 
        UNIQUE (user_id, roadmap_type);
        
        RAISE NOTICE 'Restricción UNIQUE agregada exitosamente';
    ELSE
        RAISE NOTICE 'La restricción UNIQUE ya existe';
    END IF;
END $$;

-- Crear índice para mejorar el rendimiento de las consultas
CREATE INDEX IF NOT EXISTS idx_roadmap_versions_user_roadmap 
ON roadmap_versions (user_id, roadmap_type);

-- Comentario explicativo
COMMENT ON CONSTRAINT roadmap_versions_user_roadmap_unique ON roadmap_versions 
IS 'Restricción que asegura que cada usuario solo pueda tener una versión por roadmap. Las nuevas versiones reemplazarán las existentes.';

-- Verificar que la restricción se aplicó correctamente
SELECT 
    constraint_name,
    constraint_type,
    table_name
FROM information_schema.table_constraints 
WHERE table_name = 'roadmap_versions' 
AND constraint_name = 'roadmap_versions_user_roadmap_unique'; 