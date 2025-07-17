import React, { useState, useEffect } from 'react';
import { useUser } from '../UserContext';
import { supabase } from '../lib/supabase';
import CreateProposalModal from './CreateProposalModal';
import ProposalDetailModal from './ProposalDetailModal';

const TopVersionsSection = ({ roadmapType, onVersionSelect, onEditVersion }) => {
  const { user } = useUser();
  const [topVersions, setTopVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userVotes, setUserVotes] = useState({});
  const [expandedVersions, setExpandedVersions] = useState({});
  const [proposals, setProposals] = useState({});
  const [loadingProposals, setLoadingProposals] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [userProposal, setUserProposal] = useState(null);
  const [loadingUserProposal, setLoadingUserProposal] = useState(false);

  useEffect(() => {
    loadTopVersions();
    if (user) {
      loadUserVotes();
      loadUserProposal();
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
          user:user_id (
            id,
            email,
            user_metadata
          )
        `)
        .eq('roadmap_type', roadmapType)
        .eq('is_public', true)
        .order('total_votes', { ascending: false })
        .limit(10); // Aumentar límite para mejor ranking

      if (error) {
        console.error('Error en consulta Supabase:', error);
        console.log('Detalles del error:', error.message, error.details, error.hint);
        // No lanzar error, solo mostrar versión vacía
        setTopVersions([]);
        return;
      }
      
      console.log('Versiones encontradas:', versions);
      console.log('Query ejecutada correctamente');
      
      // Mejorar el ranking considerando ratio de votos positivos
      const rankedVersions = (versions || []).map(version => {
        const totalVotes = version.total_votes || 0;
        const upVotes = version.up_votes || 0;
        const downVotes = version.down_votes || 0;
        
        // Calcular ratio de votos positivos (0 a 1)
        const positiveRatio = totalVotes > 0 ? upVotes / totalVotes : 0;
        
        // Score combinado: votos totales * ratio positivo
        const score = totalVotes * positiveRatio;
        
        // Determinar calidad basada en votos y ratio
        let quality = 'normal';
        if (totalVotes >= 10 && positiveRatio >= 0.8) {
          quality = 'excellent';
        } else if (totalVotes >= 5 && positiveRatio >= 0.7) {
          quality = 'good';
        } else if (totalVotes >= 3 && positiveRatio >= 0.6) {
          quality = 'fair';
        }
        
        return {
          ...version,
          positiveRatio,
          score,
          quality
        };
      }).sort((a, b) => b.score - a.score); // Ordenar por score mejorado
      
      setTopVersions(rankedVersions);
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

  const loadProposals = async (versionId) => {
    try {
      setLoadingProposals(prev => ({ ...prev, [versionId]: true }));
      
      // Simular carga de propuestas (aquí deberías conectar con tu base de datos)
      const mockProposals = [
        {
          id: 1,
          author: { name: 'Usuario Ejemplo' },
          created_at: new Date().toISOString(),
          changes: [
            {
              type: 'node',
              action: 'Agregar',
              before: null,
              after: 'Nuevo concepto de metalurgia'
            }
          ],
          votes: [
            { vote: 'approve' },
            { vote: 'approve' },
            { vote: 'reject' }
          ],
          status: 'pending',
          comments: []
        }
      ];
      
      setProposals(prev => ({ ...prev, [versionId]: mockProposals }));
    } catch (error) {
      console.error('Error loading proposals:', error);
    } finally {
      setLoadingProposals(prev => ({ ...prev, [versionId]: false }));
    }
  };

  const loadUserProposal = async () => {
    if (!user) return;
    
    try {
      setLoadingUserProposal(true);
      
      // Aquí deberías conectar con tu base de datos para obtener la propuesta del usuario
      // Por ahora simulamos la carga
      const mockUserProposal = null; // Cambiar a null para simular que no tiene propuesta
      
      // Simular consulta a la base de datos
      // const { data: userProposal, error } = await supabase
      //   .from('edit_proposals')
      //   .select('*')
      //   .eq('roadmap_type', roadmapType)
      //   .eq('user_id', user.id)
      //   .eq('status', 'pending')
      //   .single();
      
      setUserProposal(mockUserProposal);
    } catch (error) {
      console.error('Error loading user proposal:', error);
    } finally {
      setLoadingUserProposal(false);
    }
  };

  const toggleProposals = (versionId) => {
    const isExpanded = expandedVersions[versionId];
    setExpandedVersions(prev => ({ ...prev, [versionId]: !isExpanded }));
    
    if (!isExpanded && !proposals[versionId]) {
      loadProposals(versionId);
    }
  };

  const handleCreateProposal = (version) => {
    if (!user) {
      alert('Debes iniciar sesión para crear una propuesta');
      return;
    }

    // Verificar si el usuario ya tiene una propuesta pendiente
    if (userProposal) {
      alert('Ya tienes una propuesta pendiente. No puedes crear otra propuesta hasta que la actual sea aprobada o rechazada.');
      return;
    }

    // Redirigir al editor con la versión específica
    if (onEditVersion) {
      onEditVersion(version);
    }
  };

  const handleProposalCreated = (newProposal) => {
    // Agregar la nueva propuesta a la lista
    setProposals(prev => ({
      ...prev,
      [selectedVersion.id]: [...(prev[selectedVersion.id] || []), newProposal]
    }));
  };

  const handleProposalVote = (proposalId, vote, comment) => {
    // Aquí deberías guardar el voto en la base de datos
    console.log('Voto registrado:', { proposalId, vote, comment });
    // Recargar propuestas para actualizar estadísticas
    if (selectedVersion) {
      loadProposals(selectedVersion.id);
    }
  };

  const handleViewProposalDetails = (proposal) => {
    setSelectedProposal(proposal);
    setShowDetailModal(true);
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
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Versiones Mejor Votadas</h3>
          <p className="text-sm text-gray-600 mt-1">
            Versiones ordenadas por calidad y votos de la comunidad
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-gray-900">
            {topVersions.length} versiones
          </div>
          <div className="text-xs text-gray-500">
            {topVersions.filter(v => v.quality === 'excellent').length} excelentes
          </div>
        </div>
      </div>

      {/* Propuesta del usuario actual */}
      {user && userProposal && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-blue-900">Tu Propuesta Pendiente</h4>
            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
              En votación
            </span>
          </div>
          <p className="text-sm text-blue-700 mb-3">{userProposal.description || 'Propuesta de edición'}</p>
          <div className="flex items-center justify-between text-xs text-blue-600">
            <span>{userProposal.changes?.length || 0} cambios propuestos</span>
            <span>{userProposal.votes?.length || 0} votos recibidos</span>
          </div>
        </div>
      )}

      {topVersions.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">No hay versiones públicas</h4>
          <p className="text-gray-600">Aún no se han publicado versiones públicas de este roadmap.</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 w-md mx-auto">
            <p className="text-sm text-blue-80">           <strong>¿Quieres ser el primero?</strong> Puedes crear tu propia versión editando el roadmap y publicándola para que otros usuarios la voten.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {topVersions.map((version, index) => (
            <div
              key={version.id}
              className="border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
            >
              {/* Línea principal compacta */}
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {/* Ranking */}
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-blue-600">#{index + 1}</span>
                  </div>
                  
                  {/* Información básica */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900 truncate">
                        Versión realizada por {version.user?.user_metadata?.full_name || version.user?.email?.split('@')[0]}
                      </span>
                      {/* Badge de calidad compacto */}
                      {(version.quality === 'excellent' || version.quality === 'good' || version.quality === 'fair') && (
                        <span className={`px-2 py-0.5 text-xs rounded-full font-medium flex-shrink-0 ${
                          version.quality === 'excellent' 
                            ? 'bg-green-100 text-green-800' 
                            : version.quality === 'good'
                            ? 'bg-blue-100' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {version.quality === 'excellent' && '⭐'}
                          {version.quality === 'good' && '👍'}
                          {version.quality === 'fair' && '⚖️'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                      <span>{new Date(version.created_at).toLocaleDateString('es-ES')}</span>
                      <span>•</span>
                      <span className="text-green-600">👍 {version.up_votes || 0}</span>
                    </div>
                  </div>
                </div>
                
                {/* Botones de acción */}
                <div className="flex items-center space-x-2">
                  {/* Botón desplegable */}
                  <button
                    onClick={() => toggleProposals(version.id)}
                    className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                    title="Ver detalles"
                  >
                    <svg 
                      className={`w-4 h-4 transition-transform duration-200 ${expandedVersions[version.id] ? 'rotate-90' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  {/* Botón mostrar versión */}
                  {onVersionSelect && (
                    <button
                      onClick={() => onVersionSelect(version)}
                      className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      Mostrar
                    </button>
                  )}
                </div>
              </div>

              {/* Contenido desplegable */}
              {expandedVersions[version.id] && (
                <div className="border-t border-gray-200 bg-gray-50 p-4">
                  {/* Descripción */}
                  {version.description && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-700">{version.description}</p>
                    </div>
                  )}
                  
                  {/* Sección de votación */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleVote(version.id, 'up')}
                        className={`p-2 rounded-lg transition-colors ${
                          userVotes[version.id] === 'up'
                            ? 'bg-green-100 text-green-700 border-2 border-green-300'
                            : 'bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-700 border-transparent'
                        }`}
                        title={`Votar positivamente${userVotes[version.id] === 'up' ? ' (click para quitar voto)' : ''}`}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleVote(version.id, 'down')}
                        className={`p-2 rounded-lg transition-colors ${
                          userVotes[version.id] === 'down'
                            ? 'bg-red-100 text-red-700 border-2 border-red-300'
                            : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-700 border-transparent'
                        }`}
                        title={`Votar negativamente${userVotes[version.id] === 'down' ? ' (click para quitar voto)' : ''}`}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      {userVotes[version.id] && (
                        <span className="text-xs text-gray-500">
                          Tu voto: {userVotes[version.id] === 'up' ? '👍' : '👎'}
                        </span>
                      )}
                    </div>
                    
                    {/* Botón para crear propuesta */}
                    {userProposal ? (
                      <div className="px-3 py-1 text-xs bg-gray-300 text-gray-600 rounded-lg flex items-center space-x-1 cursor-not-allowed" title="Ya tienes una propuesta pendiente">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Propuesta Pendiente</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleCreateProposal(version)}
                        className="px-3 py-1 text-xs bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-1"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Editar y Proponer</span>
                      </button>
                    )}
                  </div>

                  {/* Propuestas de edición */}
                  <div className="border-t border-gray-200 pt-3">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Propuestas de Edición</h4>
                    {loadingProposals[version.id] ? (
                      <div className="flex items-center justify-center py-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                      </div>
                    ) : proposals[version.id] && proposals[version.id].length > 0 ? (
                      <div className="space-y-2">
                        {proposals[version.id].map((proposal) => (
                          <div key={proposal.id} className="bg-white rounded p-2 border border-gray-200">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-gray-700">
                                {proposal.author.name}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-xs ${
                                proposal.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : proposal.status === 'approved'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {proposal.status === 'pending' && 'En votación'}
                                {proposal.status === 'approved' && 'Aprobado'}
                                {proposal.status === 'rejected' && 'Rechazado'}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600 mb-1">
                              {proposal.changes.map((change, index) => (
                                <div key={index}>
                                  <span className="font-medium">{change.action}:</span> {change.after}
                                </div>
                              ))}
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3 text-xs">
                                <span className="text-green-600">
                                  👍 {proposal.votes.filter(v => v.vote === 'approve').length}
                                </span>
                                <span className="text-red-600">
                                  👎 {proposal.votes.filter(v => v.vote === 'reject').length}
                                </span>
                              </div>
                              <button 
                                onClick={() => handleViewProposalDetails(proposal)}
                                className="text-xs text-blue-600 hover:text-blue-800"
                              >
                                Ver detalles
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-2 text-gray-500 text-xs">
                        No hay propuestas de edición para esta versión
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal de Creación de Propuestas */}
      {showCreateModal && selectedVersion && (
        <CreateProposalModal
          version={selectedVersion}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedVersion(null);
          }}
          onProposalCreated={handleProposalCreated}
        />
      )}

      {/* Modal de Detalles de Propuesta */}
      {showDetailModal && selectedProposal && (
        <ProposalDetailModal
          proposal={selectedProposal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedProposal(null);
          }}
          onVote={handleProposalVote}
        />
      )}
    </div>
  );
};

export default TopVersionsSection; 