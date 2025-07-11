import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { FiLogOut } from 'react-icons/fi';
import { useUser } from '../UserContext';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { 
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) alert(error.message);
  };

  if (user) {
    return (
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user.user_metadata?.name?.charAt(0) || user.email?.charAt(0)}
            </span>
          </div>
          <span className="text-sm text-gray-700 hidden sm:block">
            {user.user_metadata?.name || user.email}
          </span>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          <FiLogOut className="mr-1" />
          <span className="hidden sm:inline">Cerrar sesión</span>
        </button>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-xl sm:text-2xl font-bold mb-1 text-gray-900 text-center">Iniciar sesión</h2>
      <p className="text-gray-500 text-sm mb-6 text-center">Inicia sesión con tu cuenta de Google</p>
      
      {/* Botón Google */}
      <button
        onClick={handleGoogleAuth}
        disabled={loading}
        className="flex items-center justify-center w-full mb-4 px-6 py-3 text-base bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed font-medium text-gray-700"
      >
        <span className="flex items-center mr-3">
          <svg width="24" height="24" viewBox="0 0 48 48" style={{ display: 'block' }}>
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            <path fill="none" d="M0 0h48v48H0z"/>
          </svg>
        </span>
        {loading ? 'Cargando...' : 'Continuar con Google'}
      </button>
      
      <p className="text-xs text-gray-400 mt-4 text-center">
        Al continuar, aceptas nuestros <a href="/privacidad" className="underline hover:text-blue-600">Términos de Servicio</a> y <a href="/privacidad" className="underline hover:text-blue-600">Política de Privacidad</a>.
      </p>
    </>
  );
} 