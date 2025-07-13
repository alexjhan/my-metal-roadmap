// Script para verificar configuración de Supabase
// Ejecutar en la consola del navegador

console.log('=== Verificación de Supabase ===');

// Verificar variables de entorno
console.log('REACT_APP_SUPABASE_URL:', process.env.REACT_APP_SUPABASE_URL);
console.log('REACT_APP_SUPABASE_ANON_KEY:', process.env.REACT_APP_SUPABASE_ANON_KEY ? 'Configurada' : 'NO CONFIGURADA');

// Verificar conexión a Supabase
import { supabase } from './src/lib/supabase.js';

// Probar conexión básica
supabase
  .from('roadmap_versions')
  .select('count')
  .limit(1)
  .then(({ data, error }) => {
    if (error) {
      console.error('❌ Error conectando a roadmap_versions:', error);
    } else {
      console.log('✅ Conexión a roadmap_versions exitosa');
    }
  })
  .catch(err => {
    console.error('❌ Error general:', err);
  });

// Probar tabla auth.users
supabase
  .from('auth.users')
  .select('count')
  .limit(1)
  .then(({ data, error }) => {
    if (error) {
      console.error('❌ Error conectando a auth.users:', error);
    } else {
      console.log('✅ Conexión a auth.users exitosa');
    }
  })
  .catch(err => {
    console.error('❌ Error general:', err);
  }); 