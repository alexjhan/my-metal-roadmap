import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, roadmapService } from '../lib/supabase';
import { FiEdit, FiTrash2, FiEye, FiPlus } from 'react-icons/fi';

export default function MyRoadmaps() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar autenticación
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        alert('Debes iniciar sesión para ver tus roadmaps');
        navigate('/');
        return;
      }
      setUser(session.user);
      loadUserRoadmaps(session.user.id);
    });
  }, [navigate]);

  const loadUserRoadmaps = async (userId) => {
    try {
      const userRoadmaps = await roadmapService.getUserRoadmaps(userId);
      setRoadmaps(userRoadmaps);
    } catch (error) {
      console.error('Error cargando roadmaps:', error);
      alert('Error al cargar tus roadmaps');
    } finally {
      setLoading(false);
    }
  };

  const deleteRoadmap = async (roadmapId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este roadmap?')) {
      try {
        const { error } = await supabase
          .from('roadmaps')
          .delete()
          .eq('id', roadmapId);
        
        if (error) throw error;
        
        // Recargar roadmaps
        await loadUserRoadmaps(user.id);
        alert('Roadmap eliminado exitosamente');
      } catch (error) {
        console.error('Error eliminando roadmap:', error);
        alert('Error al eliminar el roadmap');
      }
    }
  };

  const editRoadmap = (roadmapId) => {
    // Por ahora navegamos a crear con datos existentes
    // En el futuro esto abriría un formulario de edición
    navigate(`/edit/${roadmapId}`);
  };

  const viewRoadmap = (roadmapId) => {
    navigate(`/roadmap/${roadmapId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Cargando tus roadmaps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Roadmaps</h1>
              <p className="text-gray-600">Gestiona tus roadmaps personalizados</p>
            </div>
            <button
              onClick={() => navigate('/create')}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <FiPlus className="mr-2" />
              Crear Nuevo
            </button>
          </div>
        </div>

        {/* Lista de roadmaps */}
        {roadmaps.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes roadmaps aún</h3>
            <p className="text-gray-600 mb-6">Crea tu primer roadmap personalizado</p>
            <button
              onClick={() => navigate('/create')}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Crear Mi Primer Roadmap
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roadmaps.map((roadmap) => (
              <div key={roadmap.id} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{roadmap.emoji}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{roadmap.title}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(roadmap.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => viewRoadmap(roadmap.id)}
                      className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                      title="Ver roadmap"
                    >
                      <FiEye />
                    </button>
                    <button
                      onClick={() => editRoadmap(roadmap.id)}
                      className="p-2 text-green-600 hover:text-green-800 transition-colors"
                      title="Editar roadmap"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => deleteRoadmap(roadmap.id)}
                      className="p-2 text-red-600 hover:text-red-800 transition-colors"
                      title="Eliminar roadmap"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
                
                {roadmap.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {roadmap.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>
                    {roadmap.is_public ? '🌐 Público' : '🔒 Privado'}
                  </span>
                  <span>
                    {roadmap.updated_at !== roadmap.created_at ? 'Editado' : 'Creado'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 