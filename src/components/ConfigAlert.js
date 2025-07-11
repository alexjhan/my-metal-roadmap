import React from 'react';
import { FiAlertCircle, FiExternalLink } from 'react-icons/fi';

export default function ConfigAlert() {
  // Verificar si las variables de entorno están configuradas
  const isConfigured = process.env.REACT_APP_SUPABASE_URL && 
                       process.env.REACT_APP_SUPABASE_ANON_KEY &&
                       process.env.REACT_APP_SUPABASE_URL !== 'tu_url_de_supabase' &&
                       process.env.REACT_APP_SUPABASE_ANON_KEY !== 'tu_anon_key_de_supabase';

  // Si está configurado, no mostrar nada
  if (isConfigured) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <FiAlertCircle className="text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">
            Configuración de Base de Datos Requerida
          </h3>
          <div className="text-sm text-yellow-700 space-y-2">
            <p>
              Para usar todas las funcionalidades, necesitas configurar Supabase:
            </p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Crea un proyecto en <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline inline-flex items-center">
                Supabase <FiExternalLink className="ml-1" />
              </a></li>
              <li>Crea un archivo <code className="bg-yellow-100 px-1 rounded">.env</code> en la raíz del proyecto</li>
              <li>Agrega tus credenciales de Supabase al archivo <code className="bg-yellow-100 px-1 rounded">.env</code></li>
              <li>Ejecuta el SQL de <code className="bg-yellow-100 px-1 rounded">SETUP_DATABASE.md</code></li>
            </ol>
            <div className="mt-3 p-3 bg-yellow-100 rounded border border-yellow-200">
              <p className="text-xs font-mono">
                REACT_APP_SUPABASE_URL=tu_url_de_supabase<br/>
                REACT_APP_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 