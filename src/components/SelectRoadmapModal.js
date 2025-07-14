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
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gestionar Roadmaps</h2>
            <p className="text-gray-600 mt-1">Edita versiones existentes o crea nuevas versiones</p>
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

        {/* Contenido */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Todos los Roadmaps</h3>
            <p className="text-sm text-gray-600">Edita versiones existentes o crea nuevas versiones</p>
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

          {loadingVersions ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Cargando roadmaps...</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredRoadmaps.map((roadmap) => {
                const versions = getRoadmapVersions(roadmap.link.replace('/roadmap/', ''));
                const userVersion = getUserVersion(roadmap.link.replace('/roadmap/', ''));
                
                return (
                  <div key={roadmap.link} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3 mb-3">
                      <span className="text-2xl">{roadmap.icon}</span>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{roadmap.title}</h3>
                        <p className="text-sm text-gray-600">{roadmap.description}</p>
                      </div>
                    </div>
                    
                    {/* Opción para crear nueva versión */}
                    <div className="mb-3">
                      <button
                        onClick={() => handleCreateNewVersion(roadmap.link.replace('/roadmap/', ''))}
                        className="w-full p-3 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer text-blue-600 font-medium"
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <span>Crear Nueva Versión</span>
                        </div>
                      </button>
                    </div>
                    
                    {versions.length === 0 ? (
                      <div className="text-center py-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No hay versiones existentes de este roadmap</p>
                        <p className="text-xs text-gray-400 mt-1">Usa el botón de arriba para crear la primera versión</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Versiones Existentes:</h4>
                        {versions.map((version) => {
                          const isUserVersion = version.user_id === user.id;
                          return (
                            <div
                              key={version.id}
                              onClick={() => handleVersionSelect(roadmap.link.replace('/roadmap/', ''), version)}
                              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer bg-white"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-2">
                                  {isUserVersion ? (
                                    <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                      Mi Versión
                                    </span>
                                  ) : (
                                    <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                      Versión de Otro
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {version.description || `Versión creada el ${new Date(version.created_at).toLocaleDateString()}`}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(version.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="text-sm text-gray-500">
                                {isUserVersion ? 'Editar' : 'Proponer Cambios'}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {filteredRoadmaps.length === 0 && (
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
              </svg>
              <p className="text-gray-500">No se encontraron roadmaps que coincidan con tu búsqueda</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectRoadmapModal; 