// Configuración para desarrollo local
export const devConfig = {
  // Indicar si estamos en modo desarrollo
  isDevelopment: process.env.NODE_ENV === 'development' && 
                 (window.location.hostname === 'localhost' || 
                  window.location.hostname === '127.0.0.1'),
  
  // Configuración de Supabase para desarrollo
  supabase: {
    url: process.env.REACT_APP_SUPABASE_URL || 'https://placeholder.supabase.co',
    anonKey: process.env.REACT_APP_SUPABASE_ANON_KEY || 'placeholder_key'
  },
  
  // Usuario simulado para desarrollo
  devUser: {
    id: 'dev-user-123',
    email: 'dev@localhost.com',
    name: 'Usuario Desarrollo'
  }
}; 