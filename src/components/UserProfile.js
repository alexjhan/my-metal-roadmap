import React, { useState } from 'react';
import { useUser } from '../UserContext';
import { supabase } from '../lib/supabase';
import { FiUser, FiSettings, FiLogOut, FiChevronDown } from 'react-icons/fi';

export default function UserProfile() {
  const { user } = useUser();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!user) return null;

  // Función para obtener la foto del usuario
  const getUserPhoto = () => {
    // Si tiene foto de Google, usarla
    if (user.user_metadata?.picture) {
      return user.user_metadata.picture;
    }
    
    // Si tiene avatar_url, usarla
    if (user.user_metadata?.avatar_url) {
      return user.user_metadata.avatar_url;
    }
    
    // Si no, usar Gravatar con el email
    const email = user.email;
    const hash = btoa(email.trim().toLowerCase()); // MD5 hash simplificado
    return `https://www.gravatar.com/avatar/${hash}?d=mp&s=200`;
  };

  // Función para obtener el nombre del usuario
  const getUserName = () => {
    return user.user_metadata?.full_name || 
           user.user_metadata?.name || 
           user.email?.split('@')[0] || 
           'Usuario';
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setShowDropdown(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="relative">
      {/* Botón del perfil */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <img
          src={getUserPhoto()}
          alt="Perfil"
          className="w-8 h-8 rounded-full object-cover border-2 border-blue-500"
        />
        <span className="text-sm font-medium text-gray-700 hidden sm:block">
          {getUserName()}
        </span>
        <FiChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown del perfil */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* Header del perfil */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <img
                src={getUserPhoto()}
                alt="Perfil"
                className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
              />
              <div>
                <p className="text-sm font-semibold text-gray-900">{getUserName()}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Opciones del menú */}
          <div className="py-1">
            <button
              onClick={() => {
                // Aquí puedes agregar navegación al perfil
                setShowDropdown(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <FiUser className="mr-3 w-4 h-4" />
              Mi Perfil
            </button>
            
            <button
              onClick={() => {
                // Aquí puedes agregar navegación a configuraciones
                setShowDropdown(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <FiSettings className="mr-3 w-4 h-4" />
              Configuración
            </button>
            
            <div className="border-t border-gray-100 my-1"></div>
            
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <FiLogOut className="mr-3 w-4 h-4" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}

      {/* Overlay para cerrar el dropdown al hacer clic fuera */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
} 