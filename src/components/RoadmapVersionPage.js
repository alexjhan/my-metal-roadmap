import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import GraphLayout from './GraphLayout';
import RoadmapLayout from './RoadmapLayout';

const RoadmapVersionPage = () => {
  const { roadmapType, versionId } = useParams();
  const navigate = useNavigate();
  const [version, setVersion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadVersion();
  }, [versionId]);

  const loadVersion = async () => {
    try {
      setLoading(true);
      
      const { data: versionData, error } = await supabase
        .from('roadmap_versions')
        .select(`
          *,
          user:users(name, email)
        `)
        .eq('id', versionId)
        .eq('is_public', true)
        .single();

      if (error) throw error;
      
      setVersion(versionData);
    } catch (error) {
      console.error('Error loading version:', error);
      setError('No se pudo cargar la versión del roadmap');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando versión...</p>
        </div>
      </div>
    );
  }

  if (error || !version) {
    return (
      <div className="w-full h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Versión no encontrada</h1>
          <p className="text-gray-600 mb-6">{error || 'La versión solicitada no existe o no es pública.'}</p>
          <button
            onClick={() => navigate(`/roadmap/${roadmapType}`)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Volver al Roadmap
          </button>
        </div>
      </div>
    );
  }

  return (
    <RoadmapLayout
      title={`${roadmapType.charAt(0).toUpperCase() + roadmapType.slice(1)} - Versión de ${version.user?.name || 'Usuario'}`}
      description={`Versión editada el ${new Date(version.created_at).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`}
      icon="📊"
    >
      {/* Información de la versión */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">
                {version.user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">
                Versión por {version.user?.name || 'Usuario'}
              </p>
              <p className="text-sm text-gray-600">
                {new Date(version.created_at).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
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
            <div className="text-center">
              <div className="text-sm font-medium text-red-600">
                -{version.down_votes || 0}
              </div>
              <div className="text-xs text-gray-500">negativos</div>
            </div>
          </div>
        </div>
        
        {version.description && (
          <p className="text-gray-700 mt-3 text-sm">{version.description}</p>
        )}
      </div>

      {/* Gráfico del roadmap */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <GraphLayout 
          roadmapType={roadmapType} 
          customNodes={version.nodes}
          customEdges={version.edges}
          readOnly={true}
        />
      </div>

      {/* Botón para volver */}
      <div className="mt-6 text-center">
        <button
          onClick={() => navigate(`/roadmap/${roadmapType}`)}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Volver al Roadmap Original
        </button>
      </div>
    </RoadmapLayout>
  );
};

export default RoadmapVersionPage; 