import React, { useCallback, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Auth from "./Auth";
import { UserProfileDropdown } from "./UserProfile";
import { supabase } from "../lib/supabase";
import { useUser } from '../UserContext';
import SelectRoadmapModal from './SelectRoadmapModal';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useUser();
  const [showAuth, setShowAuth] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [creating, setCreating] = useState(false);
  const [showSelectRoadmapModal, setShowSelectRoadmapModal] = useState(false);

  const handleCreateRoadmap = async () => {
    if (!newTitle) return;
    setCreating(true);
    try {
      const userId = user.id;
      const { data, error } = await supabase
        .from('roadmaps')
        .insert([{ title: newTitle, description: newDesc, user_id: userId }])
        .select();
      if (error) throw error;
      if (data && data[0]) {
        setShowCreateModal(false);
        setNewTitle("");
        setNewDesc("");
        navigate(`/edit/${data[0].id}`);
      }
    } catch (err) {
      alert('Error al crear roadmap: ' + err.message);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return null; // No mostrar nada mientras carga
  }

  return (
    <nav className="w-full bg-blue-950 z-[1000]">
      <div className="flex justify-between items-center w-full py-4 sm:py-6 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity min-h-[4rem]">
          <img
            src="/assets/logo.png"
            alt="MetalRoadmap"
            className="filter brightness-0 invert"
            style={{
              height: "4rem",
              width: "auto",
              objectFit: "contain",
              padding: "0.3rem",
            }}
            onClick={() => {
              navigate('/');
            }}
          />
          <h1
            className="hidden sm:block text-4xl font-bold transition-all duration-500 cursor-pointer"
            style={{
              fontFamily: "'Great Vibes', cursive",
              fontSize: "1.5rem",
              lineHeight: "2rem",
              color: "#ffffff",
              padding: "0.3rem",
            }}
            onClick={() => {
              navigate('/');
            }}
          >
            San Antonio Abad
          </h1>
        </Link>
        
        {/* Texto IA Tutor Pronto - siempre visible */}
        <div className="hidden md:block">
          <div className="flex items-center space-x-2">
            <span className="text-2xl filter grayscale">🤖</span>
            <span className="text-blue-200 text-sm font-medium underline">IA Tutor Pronto</span>
          </div>
        </div>
        
        {/* Navegación para usuarios autenticados */}
        {user && (
          <div className="flex items-center space-x-2 sm:space-x-4">
            <span
              className="text-xs sm:text-sm text-gray-400 cursor-not-allowed opacity-50 line-through"
            >
              Mis Roadmaps
            </span>
            <button
              onClick={() => setShowSelectRoadmapModal(true)}
              className="inline-flex items-center px-3 sm:px-5 py-2 bg-blue-800 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-blue-700 hover:border-blue-600 hover:bg-blue-700 text-xs sm:text-sm font-medium whitespace-nowrap"
              style={{ minWidth: '120px', justifyContent: 'center' }}
            >
              <span className="mr-1 sm:mr-2">🗂️</span>
              <span className="hidden sm:inline">Gestionar Roadmaps</span>
              <span className="sm:hidden">Gestionar</span>
            </button>
            <UserProfileDropdown />
          </div>
        )}
        {/* Botones para visitantes */}
        {!user && (
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => setShowAuth(true)}
              className="px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium bg-white text-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 whitespace-nowrap min-w-[80px] sm:min-w-[100px] md:min-w-[120px] lg:min-w-[140px]"
            >
              <span className="hidden sm:inline">Iniciar sesión</span>
              <span className="sm:hidden">Iniciar</span>
            </button>
            <button
              onClick={() => setShowAuth(true)}
              className="px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium bg-gray-900 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:bg-gray-800 whitespace-nowrap min-w-[80px] sm:min-w-[100px] md:min-w-[120px] lg:min-w-[140px]"
            >
              <span className="hidden sm:inline">Registrarse</span>
              <span className="sm:hidden">Registro</span>
            </button>
          </div>
        )}
      </div>
      {/* Modal de Auth */}
      {showAuth && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm sm:max-w-md relative mx-4">
            <button onClick={() => setShowAuth(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl">&times;</button>
            <Auth />
          </div>
        </div>
      )}
      {/* Modal para gestionar roadmaps */}
      {showSelectRoadmapModal && (
        <SelectRoadmapModal isOpen={showSelectRoadmapModal} onClose={() => setShowSelectRoadmapModal(false)} />
      )}
      {/* Modal para crear roadmap */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
            <button onClick={() => setShowCreateModal(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl">&times;</button>
            <h2 className="text-xl font-bold mb-4">Crear nuevo Roadmap</h2>
            <input
              type="text"
              placeholder="Título"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              className="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Descripción"
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateRoadmap}
                disabled={creating || !newTitle}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:bg-gray-300"
              >
                {creating ? 'Creando...' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        h1:hover {
          background: linear-gradient(270deg, #6e7b8b, #bfa14c, #6e7b8b);
          background-size: 1000% 1000%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shine 3s linear infinite;
        }

        @keyframes shine {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </nav>
  );
}
