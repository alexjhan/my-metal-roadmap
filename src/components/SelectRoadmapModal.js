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
            const roadmapType = roadmap.link.replace('/roadmap/', '');
            console.log(`Cargando versiones para roadmap: ${roadmapType}`);
            
            // Obtener versiones del usuario para este roadmap
            const userVersions = await roadmapService.getUserRoadmapVersions(user.id, roadmapType);
            console.log(`Versiones del usuario para ${roadmapType}:`, userVersions);
            
            // Obtener también versiones públicas
            const publicVersions = await roadmapService.getRoadmapVersions(roadmapType);
            console.log(`Versiones públicas para ${roadmapType}:`, publicVersions);
            
            // Combinar versiones del usuario y públicas
            const allVersions = [...userVersions, ...publicVersions];
            versionsByRoadmap[roadmapType] = allVersions;
            console.log(`Total de versiones para ${roadmapType}:`, allVersions.length);
          } catch (error) {
            console.error(`Error cargando versiones para ${roadmap.title}:`, error);
            versionsByRoadmap[roadmap.link.replace('/roadmap/', '')] = [];
          }
        }
      }
      
      console.log('Todas las versiones cargadas:', versionsByRoadmap);
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
    console.log('handleVersionSelect llamado con:', { roadmapType, version });
    
    // Verificar si la versión pertenece al usuario actual
    const isUserVersion = version.user_id === user.id;
    console.log('¿Es versión del usuario?', isUserVersion);
    
    if (isUserVersion) {
      // Si es la versión del usuario, ir al modo editor normal
      const url = `/edit/${roadmapType}?version=${version.id}`;
      console.log('Navegando a:', url);
      navigate(url);
    } else {
      // Si no es la versión del usuario, ir al modo propuesta
      const url = `/edit/${roadmapType}?version=${version.id}&mode=proposal`;
      console.log('Navegando a (modo propuesta):', url);
      navigate(url);
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
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-1">Gestionar Roadmaps</h2>
              <p className="text-blue-100 text-xs">Edita versiones existentes o crea nuevas versiones</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-100 transition-colors p-2 rounded-full hover:bg-white hover:bg-opacity-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {/* Filtros */}
          <div className="mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Buscador */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar roadmaps..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-3 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Filtro por categoría */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Cargando roadmaps...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
              {filteredRoadmaps.map((roadmap) => {
                const versions = getRoadmapVersions(roadmap.link.replace('/roadmap/', ''));
                const userVersion = getUserVersion(roadmap.link.replace('/roadmap/', ''));
                const hasUserVersion = !!userVersion;
                
                return (
                  <div key={roadmap.link} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                    {/* Header del roadmap */}
                    <div className="bg-gray-50 p-3 border-b border-gray-200">
                      <div className="flex items-center space-x-2">
                        <div className="flex-shrink-0">
                          <span className="text-2xl">{roadmap.icon}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base font-bold text-gray-900 mb-1">{roadmap.title}</h3>
                          <p className="text-sm text-gray-600 mb-1">{roadmap.description}</p>
                          <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">
                            {roadmap.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3">
                      {/* Botón de crear nueva versión */}
                      {!hasUserVersion && (
                        <div className="mb-3">
                          <button
                            onClick={() => handleCreateNewVersion(roadmap.link.replace('/roadmap/', ''))}
                            className="w-full p-2 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 cursor-pointer group"
                          >
                            <div className="flex items-center justify-center space-x-2">
                              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                              </div>
                              <div className="text-center">
                                <span className="text-sm font-semibold text-blue-600 block">Crear Nueva Versión</span>
                                <span className="text-xs text-gray-500">Comienza desde cero</span>
                              </div>
                            </div>
                          </button>
                        </div>
                      )}
                      
                      {/* Versiones existentes */}
                      {versions.length === 0 ? (
                        <div className="text-center py-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl mb-1">📚</div>
                          <p className="text-gray-500 font-medium text-sm">No hay versiones existentes</p>
                          {!hasUserVersion && (
                            <p className="text-xs text-gray-400 mt-1">Usa el botón de arriba para crear la primera versión</p>
                          )}
                        </div>
                      ) : (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                            <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            Versiones ({versions.length})
                          </h4>
                          <div className="space-y-2">
                            {versions.map((version) => {
                              const isUserVersion = version.user_id === user.id;
                              return (
                                <div
                                  key={version.id}
                                  onClick={() => handleVersionSelect(roadmap.link.replace('/roadmap/', ''), version)}
                                  className="flex items-center justify-between p-2 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all duration-200 cursor-pointer bg-white group"
                                >
                                  <div className="flex items-center space-x-2">
                                    <div className="flex-shrink-0">
                                      {isUserVersion ? (
                                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                          </svg>
                                        </div>
                                      ) : (
                                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                          </svg>
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2 mb-1">
                                        {isUserVersion ? (
                                          <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full font-medium">
                                            Mi Versión
                                          </span>
                                        ) : (
                                          <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">
                                            Versión de Otro
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-sm font-medium text-gray-900">
                                        {version.description || `Versión creada el ${new Date(version.created_at).toLocaleDateString()}`}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {new Date(version.created_at).toLocaleDateString()}
                                      </p>
                                      <p className="text-xs text-blue-900 font-semibold mt-1">Votos: {version.total_votes ?? 0}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xs font-medium text-gray-500 group-hover:text-blue-600 transition-colors">
                                      {isUserVersion ? 'Editar' : 'Proponer Cambios'}
                                    </span>
                                    <svg className="w-3 h-3 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg font-medium">No se encontraron roadmaps que coincidan con tu búsqueda</p>
              <p className="text-gray-400 text-sm mt-1">Intenta ajustar los filtros de búsqueda</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectRoadmapModal; 