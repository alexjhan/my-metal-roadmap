import React, { useState } from 'react';
import { useUser } from '../UserContext';

const EditProposal = ({ proposal, onVote, onClose }) => {
  const { user } = useUser();
  const [vote, setVote] = useState(null);
  const [comment, setComment] = useState('');

  const handleVote = (voteType) => {
    if (!user) {
      alert('Debes iniciar sesión para votar');
      return;
    }
    setVote(voteType);
  };

  const handleSubmitVote = () => {
    if (!vote) {
      alert('Debes seleccionar un voto');
      return;
    }
    onVote(proposal.id, vote, comment);
    onClose();
  };

  const getVotePercentage = (votes, type) => {
    if (votes.length === 0) return 0;
    const typeVotes = votes.filter(v => v.vote === type).length;
    return Math.round((typeVotes / votes.length) * 100);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Propuesta de Edición</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Información de la propuesta */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Propuesta por: {proposal.author.name}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {new Date(proposal.created_at).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>

          {/* Cambios propuestos */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Cambios propuestos:</h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              {proposal.changes.map((change, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {change.type === 'node' ? 'Nodo' : 'Conexión'}
                    </span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-sm text-gray-600">{change.action}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="font-medium">Antes:</span>
                        <div className="mt-1 p-2 bg-red-50 rounded text-xs">
                          {change.before || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Después:</span>
                        <div className="mt-1 p-2 bg-green-50 rounded text-xs">
                          {change.after || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Estadísticas de votación */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Votación actual:</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-700">Aprobado</span>
                  <span className="text-sm font-bold text-green-700">
                    {getVotePercentage(proposal.votes, 'approve')}%
                  </span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${getVotePercentage(proposal.votes, 'approve')}%` }}
                  ></div>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  {proposal.votes.filter(v => v.vote === 'approve').length} votos
                </p>
              </div>
              <div className="bg-red-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-red-700">Rechazado</span>
                  <span className="text-sm font-bold text-red-700">
                    {getVotePercentage(proposal.votes, 'reject')}%
                  </span>
                </div>
                <div className="w-full bg-red-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${getVotePercentage(proposal.votes, 'reject')}%` }}
                  ></div>
                </div>
                <p className="text-xs text-red-600 mt-1">
                  {proposal.votes.filter(v => v.vote === 'reject').length} votos
                </p>
              </div>
            </div>
          </div>

          {/* Tu voto */}
          {user && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Tu voto:</h4>
              <div className="flex items-center space-x-4 mb-4">
                <button
                  onClick={() => handleVote('approve')}
                  className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                    vote === 'approve'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-300 hover:border-green-500'
                  }`}
                >
                  👍 Aprobar
                </button>
                <button
                  onClick={() => handleVote('reject')}
                  className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                    vote === 'reject'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-300 hover:border-red-500'
                  }`}
                >
                  👎 Rechazar
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comentario (opcional):
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Explica tu voto..."
                />
              </div>
            </div>
          )}

          {/* Comentarios de otros usuarios */}
          {proposal.comments && proposal.comments.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Comentarios:</h4>
              <div className="space-y-3 max-h-40 overflow-y-auto">
                {proposal.comments.map((comment, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {comment.author.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{comment.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Estado:</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
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
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cerrar
            </button>
            {user && vote && (
              <button
                onClick={handleSubmitVote}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Enviar Voto
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProposal; 