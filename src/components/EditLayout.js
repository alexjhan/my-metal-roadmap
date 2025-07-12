import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import { devConfig } from '../config/dev';

// Modo de desarrollo - permite acceso sin autenticación en localhost
const isDevelopment = devConfig.isDevelopment;

export default function EditLayout({ children }) {
  const navigate = useNavigate();
  const { user, loading } = useUser();

  // En modo desarrollo, permitir acceso sin autenticación
  if (isDevelopment) {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    );
  }

  // En producción, verificar autenticación
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso Requerido</h1>
          <p className="text-gray-600 mb-6">Debes iniciar sesión para acceder al editor de roadmaps.</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
} 