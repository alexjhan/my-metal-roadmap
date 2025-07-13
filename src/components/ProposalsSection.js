import React, { useState, useEffect } from 'react';
import { useUser } from '../UserContext';
import { proposalService } from '../lib/roadmapStorage';
import EditProposal from './EditProposal';

const ProposalsSection = ({ roadmapType }) => {
  const { user } = useUser();
  const [proposals, setProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProposals = async () => {
      try {
        setLoading(true);
        const proposalsData = await proposalService.getProposals(roadmapType);
        setProposals(proposalsData);
      } catch (error) {
        console.error('Error loading proposals:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProposals();
  }, [roadmapType]);

  const handleVote = async (proposalId, vote, comment) => {
    try {
      await proposalService.voteOnProposal(proposalId, user.id, vote, comment);
      // Recargar propuestas
      const proposalsData = await proposalService.getProposals(roadmapType);
      setProposals(proposalsData);
    } catch (error) {
      console.error('Error voting on proposal:', error);
      alert('Error al votar: ' + error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'En votación';
      case 'approved':
        return 'Aprobado';
      case 'rejected':
        return 'Rechazado';
      default:
        return 'Desconocido';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Propuestas de Edición</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  const pendingProposals = proposals.filter(p => p.status === 'pending');
  const approvedProposals = proposals.filter(p => p.status === 'approved');
  const rejectedProposals = proposals.filter(p => p.status === 'rejected');

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Propuestas de Edición</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
              <span>{pendingProposals.length} pendientes</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>{approvedProposals.length} aprobadas</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-red-400 rounded-full"></span>
              <span>{rejectedProposals.length} rechazadas</span>
            </span>
          </div>
        </div>

        {proposals.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No hay propuestas</h4>
            <p className="text-gray-600">Aún no se han creado propuestas de edición para este roadmap.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Propuestas pendientes */}
            {pendingProposals.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                  Pendientes de votación
                </h4>
                <div className="space-y-3">
                  {pendingProposals.map((proposal) => (
                    <div
                      key={proposal.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
                      onClick={() => setSelectedProposal(proposal)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              U
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              Usuario
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(proposal.created_at).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(proposal.status)}`}>
                          {getStatusText(proposal.status)}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3">{proposal.description}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{proposal.changes?.length || 0} cambios propuestos</span>
                        <span>{proposal.votes?.length || 0} votos</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Propuestas aprobadas */}
            {approvedProposals.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  Aprobadas
                </h4>
                <div className="space-y-3">
                  {approvedProposals.map((proposal) => (
                    <div
                      key={proposal.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-colors cursor-pointer"
                      onClick={() => setSelectedProposal(proposal)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-green-600">
                              U
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              Usuario
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(proposal.created_at).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(proposal.status)}`}>
                          {getStatusText(proposal.status)}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3">{proposal.description}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{proposal.changes?.length || 0} cambios aplicados</span>
                        <span>{proposal.votes?.length || 0} votos</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Propuestas rechazadas */}
            {rejectedProposals.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                  Rechazadas
                </h4>
                <div className="space-y-3">
                  {rejectedProposals.map((proposal) => (
                    <div
                      key={proposal.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-red-300 transition-colors cursor-pointer"
                      onClick={() => setSelectedProposal(proposal)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-red-600">
                              U
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              Usuario
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(proposal.created_at).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(proposal.status)}`}>
                          {getStatusText(proposal.status)}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3">{proposal.description}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{proposal.changes?.length || 0} cambios rechazados</span>
                        <span>{proposal.votes?.length || 0} votos</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de propuesta seleccionada */}
      {selectedProposal && (
        <EditProposal
          proposal={selectedProposal}
          onVote={handleVote}
          onClose={() => setSelectedProposal(null)}
        />
      )}
    </>
  );
};

export default ProposalsSection; 