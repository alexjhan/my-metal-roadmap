import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { progressService } from '../lib/roadmapStorage';
import { allRoadmaps, roadmapCategories, difficultyLevels } from './editor/constants';
import { useUser } from '../UserContext';
import { 
  FiUser, 
  FiMail, 
  FiCalendar, 
  FiTrendingUp, 
  FiBookOpen, 
  FiClock, 
  FiAward,
  FiTarget,
  FiBarChart,
  FiActivity,
  FiLogOut,
  FiSettings
} from 'react-icons/fi';

// Componente simple para el dropdown del navbar
export function UserProfileDropdown() {
  const { user, loading } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user) {
      // Ya no necesitamos cargar perfil desde tabla profiles
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.user-profile-dropdown')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setIsOpen(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (loading || !user) return null;

  // Usar datos de auth.users
  const avatarUrl = user.user_metadata?.avatar_url || '';
  const fullName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Usuario';

  return (
    <div className="relative user-profile-dropdown">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-blue-200 hover:text-white transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt="Avatar" 
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <FiUser className="w-4 h-4 text-white" />
          )}
        </div>
        <span className="hidden sm:block text-sm font-medium">
          {fullName}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt="Avatar" 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <FiUser className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {fullName}
                </p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="p-2">
            <button
              disabled
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-400 cursor-not-allowed opacity-50"
            >
              <FiUser className="w-4 h-4" />
              <span className="line-through">Mi Perfil</span>
              <span className="text-xs text-gray-500">(No disponible)</span>
            </button>
            
            <button
              disabled
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-400 cursor-not-allowed opacity-50"
            >
              <FiBookOpen className="w-4 h-4" />
              <span className="line-through">Mis Roadmaps</span>
              <span className="text-xs text-gray-500">(No disponible)</span>
            </button>
            
            <hr className="my-2" />
            
            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <FiLogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente principal adaptado para usar solo auth.users
export default function UserProfile() {
  const { user, loading } = useUser();
  const [progressStats, setProgressStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [topRoadmaps, setTopRoadmaps] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: user?.user_metadata?.full_name || user?.user_metadata?.name || '',
    avatar_url: user?.user_metadata?.avatar_url || '',
    bio: user?.user_metadata?.bio || '',
    linkedin: user?.user_metadata?.linkedin || '',
    facebook: user?.user_metadata?.facebook || ''
  });

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = useCallback(async () => {
    try {
      // Solo cargar stats y actividad, no perfil extendido
      const [stats, activity] = await Promise.all([
        progressService.getProgressStats(user.id),
        progressService.getAllProgress(user.id)
      ]);
      setProgressStats(stats);
      setRecentActivity(activity.slice(0, 5));
      // Calcular roadmaps más populares de manera más eficiente
      const roadmapProgress = activity
        .map(p => ({
          ...p,
          roadmap: allRoadmaps.find(r => r.id === p.roadmap_type)
        }))
        .filter(p => p.roadmap)
        .sort((a, b) => b.progress_percentage - a.progress_percentage)
        .slice(0, 3);
      setTopRoadmaps(roadmapProgress);
      // Calcular logros
      calculateAchievements(stats, activity);
    } catch (error) {
      console.error('Error cargando datos del usuario:', error);
    }
  }, [user?.id]);

  const calculateAchievements = useCallback((stats, activity) => {
    const newAchievements = [];
    if (stats.completedRoadmaps >= 1) {
      newAchievements.push({
        id: 'first_complete',
        title: 'Primer Éxito',
        description: 'Completaste tu primer roadmap',
        icon: '🎉',
        color: '#10B981'
      });
    }
    if (stats.completedRoadmaps >= 5) {
      newAchievements.push({
        id: 'roadmap_master',
        title: 'Maestro de Roadmaps',
        description: 'Completaste 5 roadmaps',
        icon: '🏆',
        color: '#F59E42'
      });
    }
    setAchievements(newAchievements);
  }, []);

  const handleSaveProfile = useCallback(async () => {
    try {
      // Guardar solo en user_metadata de Supabase Auth
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: editForm.full_name,
          avatar_url: editForm.avatar_url,
          bio: editForm.bio,
          linkedin: editForm.linkedin,
          facebook: editForm.facebook
        }
      });
      if (authError) throw authError;
      setIsEditing(false);
      alert('Perfil actualizado exitosamente');
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      alert('Error al actualizar el perfil');
    }
  }, [editForm]);

  const formatTime = useCallback((minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }, []);

  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, []);

  // Memoizar estadísticas rápidas
  const quickStats = useMemo(() => [
    {
      icon: FiTrendingUp,
      color: 'blue',
      label: 'Progreso Promedio',
      value: `${progressStats.averageProgress || 0}%`
    },
    {
      icon: FiBookOpen,
      color: 'green',
      label: 'Roadmaps Completados',
      value: progressStats.completedRoadmaps || 0
    },
    {
      icon: FiClock,
      color: 'purple',
      label: 'Tiempo Total',
      value: formatTime(progressStats.totalTimeSpent || 0)
    }
  ], [progressStats.averageProgress, progressStats.completedRoadmaps, progressStats.totalTimeSpent, formatTime]);

  // Memoizar progreso por categoría
  const categoryProgress = useMemo(() => {
    return roadmapCategories.map((category) => {
      const categoryRoadmaps = recentActivity.filter(a => {
        const roadmap = allRoadmaps.find(r => r.id === a.roadmap_type);
        return roadmap?.category === category.id;
      });
      
      const totalProgress = categoryRoadmaps.reduce((sum, a) => sum + a.progress_percentage, 0);
      const averageProgress = categoryRoadmaps.length > 0 ? Math.round(totalProgress / categoryRoadmaps.length) : 0;
      
      return {
        ...category,
        averageProgress
      };
    });
  }, [recentActivity]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso Requerido</h1>
          <p className="text-gray-600">Debes iniciar sesión para ver tu perfil.</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
              <p className="mt-2 text-gray-600">Gestiona tu información personal y revisa tu progreso</p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {isEditing ? 'Cancelar' : 'Editar Perfil'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda - Información del perfil */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
                  {user?.user_metadata?.avatar_url ? (
                    <img 
                      src={user.user_metadata.avatar_url} 
                      alt="Avatar" 
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <FiUser className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                      <input
                        type="text"
                        value={editForm.full_name}
                        onChange={e => setEditForm(f => ({ ...f, full_name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 line-through">LinkedIn <span className="text-xs text-gray-400">(No disponible)</span></label>
                      <input
                        type="url"
                        value={editForm.linkedin}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-400 cursor-not-allowed line-through focus:outline-none"
                        placeholder="https://linkedin.com/in/tu-perfil"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 line-through">Facebook <span className="text-xs text-gray-400">(No disponible)</span></label>
                      <input
                        type="url"
                        value={editForm.facebook}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-400 cursor-not-allowed line-through focus:outline-none"
                        placeholder="https://facebook.com/tu-perfil"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Biografía</label>
                      <textarea
                        value={editForm.bio}
                        onChange={e => setEditForm(f => ({ ...f, bio: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                      >Cancelar</button>
                      <button
                        onClick={handleSaveProfile}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >Guardar</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {user?.user_metadata?.full_name || user?.user_metadata?.name || user.email?.split('@')[0]}
                    </h2>
                    <p className="text-gray-600 mt-1">{user.email}</p>
                    {user?.user_metadata?.bio && (
                      <p className="text-gray-700 mt-3">{user.user_metadata.bio}</p>
                    )}
                    <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
                      <FiCalendar className="w-4 h-4 mr-1" />
                      Miembro desde {formatDate(user.created_at)}
                    </div>
                  </div>
                )}
              </div>

              {/* Estadísticas rápidas */}
              <div className="space-y-4">
                {quickStats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  const colorClasses = {
                    blue: 'bg-blue-50 text-blue-600 text-blue-900',
                    green: 'bg-green-50 text-green-600 text-green-900',
                    purple: 'bg-purple-50 text-purple-600 text-purple-900'
                  };
                  
                  return (
                    <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${colorClasses[stat.color].split(' ')[0]}`}>
                      <div className="flex items-center">
                        <IconComponent className={`w-5 h-5 mr-2 ${colorClasses[stat.color].split(' ')[1]}`} />
                        <span className={`text-sm font-medium ${colorClasses[stat.color].split(' ')[2]}`}>{stat.label}</span>
                      </div>
                      <span className={`text-lg font-bold ${colorClasses[stat.color].split(' ')[2]}`}>{stat.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Columna derecha - Dashboard */}
          <div className="lg:col-span-2 space-y-6">
            {/* Logros */}
            {achievements.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiAward className="w-5 h-5 mr-2 text-yellow-600" />
                  Logros Desbloqueados
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <div 
                      key={achievement.id}
                      className="flex items-center p-4 border border-gray-200 rounded-lg"
                      style={{ borderLeftColor: achievement.color, borderLeftWidth: '4px' }}
                    >
                      <span className="text-2xl mr-3">{achievement.icon}</span>
                      <div>
                        <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Roadmaps más populares */}
            {topRoadmaps.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiTarget className="w-5 h-5 mr-2 text-blue-600" />
                  Mis Roadmaps Principales
                </h3>
                <div className="space-y-4">
                  {topRoadmaps.map((item) => (
                    <div key={item.roadmap_type} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{item.roadmap.icon}</span>
                        <div>
                          <h4 className="font-medium text-gray-900">{item.roadmap.title}</h4>
                          <p className="text-sm text-gray-600">{item.roadmap.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">{item.progress_percentage}%</div>
                        <div className="text-sm text-gray-500">{formatTime(item.time_spent)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actividad reciente */}
            {recentActivity.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiActivity className="w-5 h-5 mr-2 text-green-600" />
                  Actividad Reciente
                </h3>
                <div className="space-y-3">
                  {recentActivity.map((activity) => {
                    const roadmap = allRoadmaps.find(r => r.id === activity.roadmap_type);
                    return (
                      <div key={activity.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                        <div className="flex items-center">
                          <span className="text-xl mr-3">{roadmap?.icon || '📚'}</span>
                          <div>
                            <h4 className="font-medium text-gray-900">{roadmap?.title || activity.roadmap_type}</h4>
                            <p className="text-sm text-gray-600">
                              Progreso: {activity.progress_percentage}% • {formatDate(activity.last_accessed)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${activity.progress_percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Gráfico de progreso por categoría */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FiBarChart className="w-5 h-5 mr-2 text-purple-600" />
              Progreso por Categoría
            </h3>
              <div className="space-y-4">
                {categoryProgress.map((category) => (
                  <div key={category.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-lg mr-3">{category.icon}</span>
                      <span className="font-medium text-gray-900">{category.name}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full"
                          style={{ 
                            width: `${category.averageProgress}%`,
                            backgroundColor: category.color
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-600 w-12 text-right">
                        {category.averageProgress}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 