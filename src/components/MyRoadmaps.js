import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, roadmapService } from '../lib/supabase';
import { progressService } from '../lib/roadmapStorage';
import { allRoadmaps, roadmapCategories, difficultyLevels, roadmapUtils } from './editor/constants';
import { FiEdit, FiTrash2, FiEye, FiPlus, FiFilter, FiSearch, FiBookmark, FiClock, FiTrendingUp } from 'react-icons/fi';
import { useUser } from '../UserContext';

export default function MyRoadmaps() {
  const navigate = useNavigate();
  const { user, loading } = useUser();
  const [roadmaps, setRoadmaps] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [progressStats, setProgressStats] = useState({});
  const [roadmapsLoading, setRoadmapsLoading] = useState(true);
  
  // Filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('lastAccessed');
  const [showCompleted, setShowCompleted] = useState(true);
  const [showInProgress, setShowInProgress] = useState(true);
  const [showNotStarted, setShowNotStarted] = useState(true);

  useEffect(() => {
    // Verificar autenticación
    if (!loading && !user) {
      alert('Debes iniciar sesión para ver tus roadmaps');
      navigate('/');
      return;
    }

    if (user) {
      loadUserData(user.id);
    }
  }, [user, loading, navigate]);

  const loadUserData = useCallback(async (userId) => {
    try {
      // Cargar datos en paralelo para mejor rendimiento
      const [userRoadmaps, progress, stats] = await Promise.all([
        roadmapService.getUserRoadmaps(userId),
        progressService.getAllProgress(userId),
        progressService.getProgressStats(userId)
      ]);

      setRoadmaps(userRoadmaps);

      // Crear mapa de progreso de manera más eficiente
      const progressMap = progress.reduce((acc, p) => {
        acc[p.roadmap_type] = p;
        return acc;
      }, {});
      setUserProgress(progressMap);
      setProgressStats(stats);
    } catch (error) {
      console.error('Error cargando datos:', error);
      alert('Error al cargar tus roadmaps');
    } finally {
      setRoadmapsLoading(false);
    }
  }, []);

  const deleteRoadmap = useCallback(async (roadmapId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este roadmap?')) {
      try {
        const { error } = await supabase
          .from('roadmaps')
          .delete()
          .eq('id', roadmapId);
        
        if (error) throw error;
        
        // Recargar roadmaps
        await loadUserData(user.id);
        alert('Roadmap eliminado exitosamente');
      } catch (error) {
        console.error('Error eliminando roadmap:', error);
        alert('Error al eliminar el roadmap');
      }
    }
  }, [user?.id, loadUserData]);

  const editRoadmap = useCallback((roadmapId, versionId) => {
    if (versionId) {
      navigate(`/edit/${roadmapId}?version=${versionId}`);
    } else {
      navigate(`/edit/${roadmapId}`);
    }
  }, [navigate]);

  const viewRoadmap = useCallback((roadmapType) => {
    navigate(`/roadmap/${roadmapType}`);
  }, [navigate]);

  // Memoizar roadmaps filtrados para evitar re-cálculos
  const filteredRoadmaps = useMemo(() => {
    let filtered = allRoadmaps;

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = roadmapUtils.searchByTags(filtered, searchTerm);
    }

    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      filtered = roadmapUtils.filterByCategory(filtered, selectedCategory);
    }

    // Filtrar por dificultad
    if (selectedDifficulty !== 'all') {
      filtered = roadmapUtils.filterByDifficulty(filtered, selectedDifficulty);
    }

    // Filtrar por estado de progreso
    filtered = filtered.filter(roadmap => {
      const progress = userProgress[roadmap.id];
      const progressPercentage = progress ? progress.progress_percentage : 0;
      
      if (progressPercentage === 100 && !showCompleted) return false;
      if (progressPercentage > 0 && progressPercentage < 100 && !showInProgress) return false;
      if (progressPercentage === 0 && !showNotStarted) return false;
      
      return true;
    });

    // Ordenar
    filtered.sort((a, b) => {
      const progressA = userProgress[a.id];
      const progressB = userProgress[b.id];
      
      switch (sortBy) {
        case 'lastAccessed':
          const dateA = progressA ? new Date(progressA.last_accessed) : new Date(0);
          const dateB = progressB ? new Date(progressB.last_accessed) : new Date(0);
          return dateB - dateA;
        case 'progress':
          const progA = progressA ? progressA.progress_percentage : 0;
          const progB = progressB ? progressB.progress_percentage : 0;
          return progB - progA;
        case 'difficulty':
          const diffA = difficultyLevels.findIndex(d => d.id === a.difficulty);
          const diffB = difficultyLevels.findIndex(d => d.id === b.difficulty);
          return diffA - diffB;
        case 'name':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, selectedDifficulty, sortBy, showCompleted, showInProgress, showNotStarted, userProgress]);

  const getProgressForRoadmap = useCallback((roadmapId) => {
    return userProgress[roadmapId] || {
      progress_percentage: 0,
      completed_nodes: [],
      time_spent: 0,
      last_accessed: null
    };
  }, [userProgress]);

  const formatTime = useCallback((minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }, []);

  const getDifficultyColor = useCallback((difficulty) => {
    const level = difficultyLevels.find(d => d.id === difficulty);
    return level ? level.color : '#6B7280';
  }, []);

  const getCategoryColor = useCallback((category) => {
    const cat = roadmapCategories.find(c => c.id === category);
    return cat ? cat.color : '#6B7280';
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mis Roadmaps</h1>
              <p className="mt-2 text-gray-600">Gestiona tu progreso de aprendizaje</p>
            </div>
            <button
              onClick={() => navigate('/create')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <FiPlus className="w-5 h-5" />
              <span>Crear Roadmap</span>
            </button>
          </div>

          {/* Estadísticas */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FiTrendingUp className="w-8 h-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-600">Progreso Promedio</p>
                  <p className="text-2xl font-bold text-blue-900">{progressStats.averageProgress || 0}%</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FiEye className="w-8 h-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-600">Completados</p>
                  <p className="text-2xl font-bold text-green-900">{progressStats.completedRoadmaps || 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FiClock className="w-8 h-8 text-yellow-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-yellow-600">En Progreso</p>
                  <p className="text-2xl font-bold text-yellow-900">{progressStats.inProgressRoadmaps || 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FiBookmark className="w-8 h-8 text-purple-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-purple-600">Tiempo Total</p>
                  <p className="text-2xl font-bold text-purple-900">{formatTime(progressStats.totalTimeSpent || 0)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <FiFilter className="w-5 h-5 mr-2" />
              Filtros y Búsqueda
            </h2>
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="lastAccessed">Último acceso</option>
                <option value="progress">Progreso</option>
                <option value="difficulty">Dificultad</option>
                <option value="name">Nombre</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Búsqueda */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar roadmaps..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Categoría */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas las categorías</option>
              {roadmapCategories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>

            {/* Dificultad */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas las dificultades</option>
              {difficultyLevels.map(level => (
                <option key={level.id} value={level.id}>{level.name}</option>
              ))}
            </select>

            {/* Estado */}
            <div className="flex items-center space-x-4">
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={showCompleted}
                  onChange={(e) => setShowCompleted(e.target.checked)}
                  className="mr-2"
                />
                Completados
              </label>
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={showInProgress}
                  onChange={(e) => setShowInProgress(e.target.checked)}
                  className="mr-2"
                />
                En Progreso
              </label>
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={showNotStarted}
                  onChange={(e) => setShowNotStarted(e.target.checked)}
                  className="mr-2"
                />
                No Iniciados
              </label>
            </div>
          </div>
        </div>

        {/* Lista de Roadmaps */}
        {roadmapsLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando roadmaps...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredRoadmaps.map((roadmap) => {
              const progress = getProgressForRoadmap(roadmap.id);
              const category = roadmapCategories.find(c => c.id === roadmap.category);
              const difficulty = difficultyLevels.find(d => d.id === roadmap.difficulty);
              
              return (
                <div key={roadmap.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  {/* Header del card */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl">{roadmap.icon}</span>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{roadmap.title}</h3>
                          <p className="text-sm text-gray-600">{roadmap.description}</p>
                        </div>
                      </div>
                    </div>

                    {/* Metadatos */}
                    <div className="flex items-center space-x-4 mb-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-1" 
                          style={{ backgroundColor: getCategoryColor(roadmap.category) }}
                        ></div>
                        {category?.name}
                      </span>
                      <span className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-1" 
                          style={{ backgroundColor: getDifficultyColor(roadmap.difficulty) }}
                        ></div>
                        {difficulty?.name}
                      </span>
                      <span className="flex items-center">
                        <FiClock className="w-3 h-3 mr-1" />
                        {roadmap.estimatedTime}
                      </span>
                    </div>

                    {/* Progreso */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Progreso</span>
                        <span className="font-medium">{progress.progress_percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress.progress_percentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Estadísticas */}
                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 mb-4">
                      <div>
                        <span className="font-medium">Nodos:</span> {roadmap.totalNodes}
                      </div>
                      <div>
                        <span className="font-medium">Conexiones:</span> {roadmap.totalConnections}
                      </div>
                      <div>
                        <span className="font-medium">Tiempo:</span> {formatTime(progress.time_spent)}
                      </div>
                      <div>
                        <span className="font-medium">Versión:</span> {roadmap.version}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {roadmap.tags.slice(0, 3).map((tag, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {roadmap.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{roadmap.tags.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => viewRoadmap(roadmap.id)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                        >
                          Ver
                        </button>
                        <button
                          onClick={() => editRoadmap(roadmap.id, roadmap.versionId)}
                          className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors"
                        >
                          Editar
                        </button>
                      </div>
                      <button
                        onClick={() => deleteRoadmap(roadmap.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Eliminar roadmap"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!roadmapsLoading && filteredRoadmaps.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FiSearch className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron roadmaps</h3>
            <p className="text-gray-600">Intenta ajustar los filtros o crear un nuevo roadmap.</p>
          </div>
        )}
      </div>
    </div>
  );
} 