import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { FiMail, FiLock, FiUser, FiLogOut, FiLinkedin } from 'react-icons/fi';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verificar sesión actual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name
            }
          }
        });
        if (error) throw error;
        alert('Revisa tu email para confirmar tu cuenta!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar handleLinkedInAuth y el botón de LinkedIn
  // Agregar funciones para Google y GitHub
  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGithubAuth = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: { redirectTo: window.location.origin }
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
    <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
      {/* Login con Email */}
      <form onSubmit={handleAuth} className="flex items-center space-x-2">
        {isSignUp && (
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:bg-gray-300"
        >
          {loading ? 'Cargando...' : (isSignUp ? 'Registrarse' : 'Iniciar sesión')}
        </button>
      </form>

      {/* Separador */}
      <div className="hidden sm:block text-gray-400">|</div>

      {/* Login con Google */}
      <button
        onClick={handleGoogleAuth}
        disabled={loading}
        className="flex items-center px-4 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:bg-gray-300"
      >
        <svg className="mr-1" width="18" height="18" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.22l6.85-6.85C35.64 2.36 30.13 0 24 0 14.82 0 6.73 5.82 2.69 14.09l7.98 6.2C12.36 13.36 17.73 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.5c0-1.64-.15-3.22-.42-4.74H24v9.04h12.42c-.54 2.9-2.18 5.36-4.64 7.04l7.18 5.59C43.27 37.27 46.1 31.36 46.1 24.5z"/><path fill="#FBBC05" d="M9.69 28.29c-1.13-3.36-1.13-6.93 0-10.29l-7.98-6.2C-1.13 17.09-1.13 30.91 1.71 38.2l7.98-6.2z"/><path fill="#EA4335" d="M24 46c6.13 0 11.64-2.36 15.85-6.41l-7.18-5.59c-2.01 1.36-4.57 2.16-7.67 2.16-6.27 0-11.64-3.86-13.33-9.29l-7.98 6.2C6.73 42.18 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
        {loading ? 'Cargando...' : 'Google'}
      </button>

      {/* Login con GitHub */}
      <button
        onClick={handleGithubAuth}
        disabled={loading}
        className="flex items-center px-4 py-1 text-sm bg-gray-800 text-white rounded hover:bg-gray-900 transition-colors disabled:bg-gray-300"
      >
        <svg className="mr-1" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.461-1.11-1.461-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.744 0 .267.18.578.688.48A10.025 10.025 0 0 0 22 12.021C22 6.484 17.523 2 12 2z"/></svg>
        {loading ? 'Cargando...' : 'GitHub'}
      </button>

      {/* Cambiar modo */}
      <button
        onClick={() => setIsSignUp(!isSignUp)}
        className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
      >
        {isSignUp ? '¿Ya tienes cuenta?' : '¿Nuevo usuario?'}
      </button>
    </div>
  );
} 