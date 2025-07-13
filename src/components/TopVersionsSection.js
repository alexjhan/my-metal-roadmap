import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import { supabase } from '../lib/supabase';

const TopVersionsSection = ({ roadmapType }) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [topVersions, setTopVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userVotes, setUserVotes] = useState({});

  useEffect(() => {
    loadTopVersions();
    if (user) {
      loadUserVotes();
    }
  }, [roadmapType, user]);

  const loadTopVersions = async () => {
    try {
      setLoading(true);
      console.log('Cargando versiones para roadmap:', roadmapType);
      
      // Obtener versiones públicas ordenadas por votos
      const { data: versions, error } = await supabase
        .from('roadmap_versions')
        .select(`
          *,
          user:auth.users(name, email)
        `)
        .eq('roadmap_type', roadmapType)
        .eq('is_public', true)
        .order('total_votes', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error en consulta Supabase:', error);
        console.log('Detalles del error:', error.message, error.details, error.hint);
        // No lanzar error, solo mostrar versión vacía
        setTopVersions([]);
        return;
      }
      
      console.log('Versiones encontradas:', versions);
      console.log('Query ejecutada correctamente');
      setTopVersions(versions || []);
    } catch (error) {
      console.error('Error loading top versions:', error);
      // En caso de error, mostrar versión vacía
      setTopVersions([]);
    } finally {
      setLoading(false);
    }
  };

  const loadUserVotes = async () => {
    try {
      const { data: votes, error } = await supabase
        .from('roadmap_votes')
        .select('version_id, vote_type')
        .eq('user_id', user.id)
        .in('version_id', topVersions.map(v => v.id));

      if (error) throw error;
      
      const votesMap = {};
      votes?.forEach(vote => {
        votesMap[vote.version_id] = vote.vote_type;
      });
      setUserVotes(votesMap);
    } catch (error) {
      console.error('Error loading user votes:', error);
    }
  };

  const handleVote = async (versionId, voteType) => {
    if (!user) {
      alert('Debes iniciar sesión para votar');
      return;
    }

    try {
      // Verificar si ya votó
      const existingVote = userVotes[versionId];
      
      if (existingVote === voteType) {
        // Obtener la versión actual para calcular los nuevos contadores
        const { data: currentVersion } = await supabase
          .from('roadmap_versions')
          .select('total_votes, up_votes, down_votes')
          .eq('id', versionId)
          .single();
        
        // Remover voto
        await supabase
          .from('roadmap_votes')
          .delete()
          .eq('version_id', versionId)
          .eq('user_id', user.id);
        
        // Actualizar contador
        await supabase
          .from('roadmap_versions')
          .update({ 
            total_votes: (currentVersion?.total_votes || 0) - 1,
            [voteType === 'up' ? 'up_votes' : 'down_votes']: (currentVersion?.[voteType === 'up' ? 'up_votes' : 'down_votes'] || 0) - 1
          })
          .eq('id', versionId);
        
        setUserVotes(prev => {
          const newVotes = { ...prev };
          delete newVotes[versionId];
          return newVotes;
        });
      } else {
        // Obtener la versión actual para calcular los nuevos contadores
        const { data: currentVersion } = await supabase
          .from('roadmap_versions')
          .select('total_votes, up_votes, down_votes')
          .eq('id', versionId)
          .single();
        
        // Agregar o cambiar voto
        await supabase
          .from('roadmap_votes')
          .upsert({
            version_id: versionId,
            user_id: user.id,
            vote_type: voteType
          });
        
        // Calcular nuevos contadores
        let newTotalVotes = (currentVersion?.total_votes || 0) + 1;
        let newUpVotes = currentVersion?.up_votes || 0;
        let newDownVotes = currentVersion?.down_votes || 0;
        
        if (voteType === 'up') {
          newUpVotes += 1;
        } else {
          newDownVotes += 1;
        }
        
        // Si había un voto previo, ajustar contadores
        if (existingVote) {
          if (existingVote === 'up') {
            newUpVotes -= 1;
          } else {
            newDownVotes -= 1;
          }
        }
        
        await supabase
          .from('roadmap_versions')
          .update({
            total_votes: newTotalVotes,
            up_votes: newUpVotes,
            down_votes: newDownVotes
          })
          .eq('id', versionId);
        
        setUserVotes(prev => ({
          ...prev,
          [versionId]: voteType
        }));
      }
      
      // Recargar versiones
      loadTopVersions();
    } catch (error) {
      console.error('Error voting:', error);
      alert('Error al votar: ' + error.message);
    }
  };

  const handleViewVersion = (version) => {
    navigate(`/roadmap/${roadmapType}/version/${version.id}`);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Versiones Mejor Votadas</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Versiones Mejor Votadas</h3>
        <div className="text-sm text-gray-600">
          {topVersions.length} versiones públicas
        </div>
      </div>

      {topVersions.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">No hay versiones públicas</h4>
          <p className="text-gray-600">Aún no se han publicado versiones públicas de este roadmap.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {topVersions.map((version, index) => (
            <div
              key={version.id}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Versión por {version.user?.name || 'Usuario'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(version.created_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {version.total_votes || 0}
                    </div>
                    <div className="text-xs text-gray-500">votos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-green-600">
                      +{version.up_votes || 0}
                    </div>
                    <div className="text-xs text-gray-500">positivos</div>
                  </div>
                </div>
              </div>
              
              {version.description && (
                <p className="text-gray-700 mb-3 text-sm">{version.description}</p>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleVote(version.id, 'up')}
                    className={`p-2 rounded-lg transition-colors ${
                      userVotes[version.id] === 'up'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-700'
                    }`}
                    title="Votar positivamente"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleVote(version.id, 'down')}
                    className={`p-2 rounded-lg transition-colors ${
                      userVotes[version.id] === 'down'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-700'
                    }`}
                    title="Votar negativamente"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <button
                  onClick={() => handleViewVersion(version)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                >
                  Ver Versión
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopVersionsSection; 