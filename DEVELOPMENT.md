# Guía de Desarrollo Local

## Configuración Rápida

### 1. Iniciar el servidor de desarrollo
```bash
npm start
```

### 2. Acceder a la página de edición
Una vez que el servidor esté corriendo en `http://localhost:3000`, puedes acceder directamente a:

- **Edición de Termodinámica**: `http://localhost:3000/edit/termodinamica`

**Scripts rápidos:**
- Windows (CMD): `open-editor.bat`
- Windows (PowerShell): `.\open-editor.ps1`

### 3. Modo de Desarrollo
Cuando accedas desde `localhost`, verás un indicador amarillo que dice "Modo Desarrollo" en la parte superior. Esto significa que:

- ✅ No necesitas autenticación
- ✅ Puedes crear propuestas sin login
- ✅ Puedes votar en propuestas
- ✅ Todas las funcionalidades están disponibles

### 4. Variables de Entorno (Opcional)
Si quieres configurar Supabase para desarrollo, crea un archivo `.env.local` en la raíz del proyecto:

```env
REACT_APP_SUPABASE_URL=tu_url_de_supabase
REACT_APP_SUPABASE_ANON_KEY=tu_clave_anonima
```

**Nota**: Si no configuras las variables de entorno, el sistema funcionará con valores por defecto en modo desarrollo.

## Funcionalidades Disponibles en Desarrollo

### Edición de Nodos
- ✅ Agregar nuevos nodos
- ✅ Editar propiedades (título, icono, color, etc.)
- ✅ Duplicar nodos
- ✅ Eliminar nodos
- ✅ Conectar nodos

### Componentes Disponibles
- 📋 Título Principal
- 📝 Subtítulo
- 💡 Concepto
- 🏷️ Tipo
- 💬 Comentario
- 🧮 Fórmula
- ⚙️ Proceso

### Propuestas
- ✅ Crear propuestas de cambios
- ✅ Votar en propuestas
- ✅ Ver historial de propuestas

### Live View
- ✅ Vista previa en tiempo real
- ✅ Modo de presentación

## Solución de Problemas

### Si no puedes acceder a la página de edición:
1. Verifica que estés en `localhost:3000`
2. Asegúrate de que el servidor esté corriendo
3. Intenta recargar la página

### Si las funciones no funcionan:
1. Verifica la consola del navegador para errores
2. Asegúrate de estar en modo desarrollo (indicador amarillo visible)
3. Intenta limpiar el caché del navegador

## Notas Importantes

- **Solo funciona en localhost**: El modo de desarrollo solo está activo en `localhost` o `127.0.0.1`
- **Datos de prueba**: Los datos se cargan desde archivos estáticos en `/src/data/`
- **Sin persistencia**: Los cambios no se guardan permanentemente en modo desarrollo
- **Propuestas simuladas**: Las propuestas se crean con un usuario simulado

## Próximos Pasos

1. Configurar Supabase localmente para persistencia de datos
2. Agregar más tipos de nodos
3. Implementar funcionalidades avanzadas de edición
4. Mejorar la interfaz de usuario 