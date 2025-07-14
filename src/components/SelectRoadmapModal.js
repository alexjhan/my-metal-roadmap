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
  const [roadmapVersions, setRoadmapVersions] = useState({});
  const [loadingVersions, setLoadingVersions] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      loadUserRoadmaps();
      loadAllRoadmapVersions();
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

  const loadAllRoadmapVersions = async () => {
    if (!user) return;
    
    setLoadingVersions(true);
    try {
      const versionsByRoadmap = {};
      
      // Cargar versiones para cada roadmap disponible
      for (const roadmap of data) {
        if (roadmap.status === 'active') {
          try {
            const versions = await roadmapService.getRoadmapVersions(roadmap.link.replace('/roadmap/', ''));
            versionsByRoadmap[roadmap.link.replace('/roadmap/', '')] = versions;
          } catch (error) {
            console.error(`Error cargando versiones para ${roadmap.title}:`, error);
            versionsByRoadmap[roadmap.link.replace('/roadmap/', '')] = [];
          }
        }
      }
      
      setRoadmapVersions(versionsByRoadmap);
    } catch (error) {
      console.error('Error cargando versiones:', error);
    } finally {
      setLoadingVersions(false);
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

  const handleVersionSelect = (roadmapType, version) => {
    // Verificar si la versión pertenece al usuario actual
    const isUserVersion = version.user_id === user.id;
    
    if (isUserVersion) {
      // Si es la versión del usuario, ir al modo editor normal
      navigate(`/edit/${roadmapType}?version=${version.id}`);
    } else {
      // Si no es la versión del usuario, ir al modo propuesta
      navigate(`/edit/${roadmapType}?version=${version.id}&mode=proposal`);
    }
    onClose();
  };

  const handleCreateNewVersion = (roadmapType) => {
    // Crear nueva versión del roadmap
    navigate(`/edit/${roadmapType}`);
    onClose();
  };

  const getRoadmapVersions = (roadmapType) => {
    return roadmapVersions[roadmapType] || [];
  };

  const getUserVersion = (roadmapType) => {
    const versions = getRoadmapVersions(roadmapType);
    return versions.find(version => version.user_id === user.id);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2">Gestionar Roadmaps</h2>
              <p className="text-blue-100 text-lg">Edita versiones existentes o crea nuevas versiones</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-100 transition-colors p-2 rounded-full hover:bg-white hover:bg-opacity-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-8">
          {/* Filtros */}
          <div className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Buscador */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar roadmaps..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 pl-14 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
                <svg className="absolute left-5 top-4 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Filtro por categoría */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
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
          </div>

          {loadingVersions ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-6"></div>
              <p className="text-gray-500 text-lg">Cargando roadmaps...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-h-[60vh] overflow-y-auto">
              {filteredRoadmaps.map((roadmap) => {
                const versions = getRoadmapVersions(roadmap.link.replace('/roadmap/', ''));
                const userVersion = getUserVersion(roadmap.link.replace('/roadmap/', ''));
                const hasUserVersion = !!userVersion;
                
                return (
                  <div key={roadmap.link} className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    {/* Header del roadmap */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <span className="text-5xl">{roadmap.icon}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">{roadmap.title}</h3>
                          <p className="text-gray-600 mb-3 leading-relaxed">{roadmap.description}</p>
                          <span className="inline-block px-4 py-2 text-sm bg-blue-100 text-blue-800 rounded-full font-semibold">
                            {roadmap.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      {/* Botón de crear nueva versión */}
                      {!hasUserVersion && (
                        <div className="mb-6">
                          <button
                            onClick={() => handleCreateNewVersion(roadmap.link.replace('/roadmap/', ''))}
                            className="w-full p-6 border-2 border-dashed border-blue-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 cursor-pointer group"
                          >
                            <div className="flex items-center justify-center space-x-4">
                              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                              </div>
                              <div className="text-center">
                                <span className="text-xl font-semibold text-blue-600 block">Crear Nueva Versión</span>
                                <span className="text-sm text-gray-500">Comienza desde cero</span>
                              </div>
                            </div>
                          </button>
                        </div>
                      )}
                      
                      {/* Versiones existentes */}
                      {versions.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-xl">
                          <div className="text-4xl mb-4">📚</div>
                          <p className="text-gray-600 font-medium text-lg">No hay versiones existentes</p>
                          {!hasUserVersion && (
                            <p className="text-sm text-gray-400 mt-2">Usa el botón de arriba para crear la primera versión</p>
                          )}
                        </div>
                      ) : (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            Versiones Existentes ({versions.length})
                          </h4>
                          <div className="space-y-3">
                            {versions.map((version) => {
                              const isUserVersion = version.user_id === user.id;
                              return (
                                <div
                                  key={version.id}
                                  onClick={() => handleVersionSelect(roadmap.link.replace('/roadmap/', ''), version)}
                                  className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-300 cursor-pointer bg-white group"
                                >
                                  <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0">
                                      {isUserVersion ? (
                                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                          </svg>
                                        </div>
                                      ) : (
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                          </svg>
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-3 mb-1">
                                        {isUserVersion ? (
                                          <span className="inline-block px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full font-semibold">
                                            Mi Versión
                                          </span>
                                        ) : (
                                          <span className="inline-block px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full font-semibold">
                                            Versión de Otro
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-sm font-semibold text-gray-900">
                                        {version.description || `Versión creada el ${new Date(version.created_at).toLocaleDateString()}`}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {new Date(version.created_at).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium text-gray-500 group-hover:text-blue-600 transition-colors">
                                      {isUserVersion ? 'Editar' : 'Proponer Cambios'}
                                    </span>
                                    <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {filteredRoadmaps.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                </svg>
              </div>
              <p className="text-gray-500 text-xl font-medium">No se encontraron roadmaps que coincidan con tu búsqueda</p>
              <p className="text-gray-400 mt-2">Intenta ajustar los filtros de búsqueda</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectRoadmapModal; 