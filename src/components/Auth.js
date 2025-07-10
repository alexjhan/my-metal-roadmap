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

  const handleLinkedInAuth = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin',
        options: {
          redirectTo: window.location.origin
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

      {/* Login con LinkedIn */}
      <button
        onClick={handleLinkedInAuth}
        disabled={loading}
        className="flex items-center px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-gray-300"
      >
        <FiLinkedin className="mr-1" />
        {loading ? 'Cargando...' : 'LinkedIn'}
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