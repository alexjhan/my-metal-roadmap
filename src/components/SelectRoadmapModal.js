import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import data from '../data/metal_roadmaps.json';
import { useUser } from '../UserContext';
import { roadmapService } from '../lib/supabase';

const SelectRoadmapModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [userRoadmaps, setUserRoadmaps] = useState([]);
  const [loadingUserRoadmaps, setLoadingUserRoadmaps] = useState(false);
  const [activeTab, setActiveTab] = useState('propose'); // 'propose' o 'edit'

  useEffect(() => {
    if (isOpen && user) {
      loadUserRoadmaps();
    }
  }, [isOpen, user]);

  const loadUserRoadmaps = async () => {
    if (!user) return;
    
    setLoadingUserRoadmaps(true);
    try {
      const roadmaps = await roadmapService.getUserRoadmaps(user.id);
      setUserRoadmaps(roadmaps);
    } catch (error) {
      console.error('Error cargando roadmaps del usuario:', error);
    } finally {
      setLoadingUserRoadmaps(false);
    }
  };

  if (!isOpen) return null;

  // Organizar roadmaps por categorías
  const organizeByCategory = () => {
    const categories = {};
    data.forEach(item => {
      if (!categories[item.category]) {
        categories[item.category] = [];
      }
      categories[item.category].push(item);
    });
    return categories;
  };

  const categories = organizeByCategory();

  // Filtrar roadmaps basado en búsqueda y categoría
  const filteredRoadmaps = data.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory && item.status === 'active';
  });

  const handleRoadmapSelect = (roadmapType) => {
    // Si estamos en modo editar, ir al modo propuesta
    if (activeTab === 'edit') {
      navigate(`/edit/${roadmapType}?mode=proposal`);
    } else {
      // Si estamos en modo proponer, ir al modo normal
      navigate(`/edit/${roadmapType}`);
    }
    onClose();
  };

  const handleUserRoadmapSelect = (roadmapId) => {
    // Ir al editor en modo propuesta para el roadmap del usuario
    navigate(`/edit/${roadmapId}?mode=proposal`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gestionar Roadmaps</h2>
            <p className="text-gray-600 mt-1">Edita tu roadmap o propón versiones de otros</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('edit')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'edit'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Editar Mi Roadmap</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('propose')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'propose'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Proponer Versiones</span>
            </div>
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {activeTab === 'edit' ? (
            // Tab de editar roadmap del usuario
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Mi Roadmap</h3>
                <p className="text-sm text-gray-600">Edita tu roadmap personal en modo propuesta</p>
              </div>

              {loadingUserRoadmaps ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Cargando tus roadmaps...</p>
                </div>
              ) : userRoadmaps.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No tienes roadmaps aún</h3>
                  <p className="text-gray-600 mb-4">Crea tu primer roadmap personalizado</p>
                  <button
                    onClick={() => {
                      onClose();
                      navigate('/create');
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Crear Mi Primer Roadmap
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userRoadmaps.map((roadmap) => (
                    <div
                      key={roadmap.id}
                      onClick={() => handleUserRoadmapSelect(roadmap.id)}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer bg-white"
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{roadmap.emoji || '📚'}</span>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate">
                            {roadmap.title}
                          </h3>
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {roadmap.description}
                          </p>
                          <div className="mt-2">
                            <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                              Mi Roadmap
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Tab de proponer versiones
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Proponer Versiones</h3>
                <p className="text-sm text-gray-600">Selecciona un roadmap para proponer una nueva versión</p>
              </div>

              {/* Filtros */}
              <div className="mb-6 space-y-4">
                {/* Buscador */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar roadmaps..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {/* Filtro por categoría */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoría:</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Todas las categorías</option>
                    <option value="Ciencias Básicas">Ciencias Básicas</option>
                    <option value="Extractiva">Extractiva</option>
                    <option value="Transformativa">Transformativa</option>
                    <option value="Herramientas Extractivas">Herramientas Extractivas</option>
                    <option value="Herramientas Transformativas">Herramientas Transformativas</option>
                  </select>
                </div>
              </div>

              {/* Grid de roadmaps */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {filteredRoadmaps.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleRoadmapSelect(item.link.replace('/roadmap/', ''))}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer bg-white"
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="mt-2">
                          <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            {item.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredRoadmaps.length === 0 && (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                  </svg>
                  <p className="text-gray-500">No se encontraron roadmaps que coincidan con tu búsqueda</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectRoadmapModal; 