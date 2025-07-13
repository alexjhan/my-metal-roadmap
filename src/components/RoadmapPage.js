import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GraphLayout from './GraphLayout';
import RoadmapLayout from './RoadmapLayout';
import ProposalsSection from './ProposalsSection';
import TopVersionsSection from './TopVersionsSection';
import DebugVersions from './DebugVersions';
import VerifyTables from './VerifyTables';
import { allRoadmapsData } from '../data/allRoadmaps';
import { roadmapStorageService } from '../lib/roadmapStorage';
import { supabase } from '../lib/supabase';

export default function RoadmapPage() {
  const { roadmapType } = useParams();
  const navigate = useNavigate();
  
  // Estados para las versiones
  const [currentVersion, setCurrentVersion] = useState(null);
  const [topVersion, setTopVersion] = useState(null);
  const [loadingTopVersion, setLoadingTopVersion] = useState(true);
  
  // Obtener datos del roadmap
  const roadmapInfo = allRoadmapsData[roadmapType];
  
  // Verificar si hay datos guardados
  const hasSavedData = roadmapStorageService.hasSavedRoadmap(roadmapType);
  const savedData = roadmapStorageService.loadRoadmap(roadmapType);
  
  // Cargar la versión mejor votada
  useEffect(() => {
    const loadTopVersion = async () => {
      try {
        setLoadingTopVersion(true);
        
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
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error cargando versión mejor votada:', error);
        } else if (versions) {
          console.log('Versión mejor votada cargada:', versions);
          setTopVersion(versions);
          setCurrentVersion(versions); // Establecer como versión actual por defecto
        }
      } catch (error) {
        console.error('Error cargando versión mejor votada:', error);
      } finally {
        setLoadingTopVersion(false);
      }
    };

    loadTopVersion();
  }, [roadmapType]);
  
  // Función para cambiar a la versión mejor votada (original)
  const handleShowTopVersion = () => {
    setCurrentVersion(topVersion);
  };
  
  // Función para cambiar a una versión específica
  const handleShowVersion = (version) => {
    setCurrentVersion(version);
  };
  
  if (!roadmapInfo) {
    return (
      <div className="w-full h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Roadmap no encontrado</h1>
          <p className="text-gray-600 mb-6">El roadmap "{roadmapType}" no existe.</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <RoadmapLayout
      title={roadmapInfo.title}
      description={roadmapInfo.description}
      icon={roadmapInfo.icon}
    >
      {/* Indicador de datos guardados */}
      {hasSavedData && savedData && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-green-700 font-medium">
                Mostrando versión guardada ({new Date(savedData.lastModified).toLocaleDateString()})
              </span>
            </div>
            <button
              onClick={() => {
                if (window.confirm('¿Estás seguro de que quieres restablecer el roadmap a su estado original?')) {
                  roadmapStorageService.deleteRoadmap(roadmapType);
                  window.location.reload();
                }
              }}
              className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
              title="Restablecer a estado original"
            >
              Restablecer
            </button>
          </div>
        </div>
      )}
      
      {/* Indicador de carga */}
      {loadingTopVersion && (
        <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            <span className="text-sm text-gray-600">Cargando versión mejor votada...</span>
          </div>
        </div>
      )}
      
      {/* Indicador de versión actual */}
      {!loadingTopVersion && (
        <div className="mb-4 p-3 border rounded-lg">
          {currentVersion && currentVersion.id !== topVersion?.id ? (
            <div className="bg-blue-50 border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="text-sm text-blue-700 font-medium">
                    Mostrando versión de usuario ({currentVersion.total_votes || 0} votos)
                  </span>
                </div>
                {topVersion && (
                  <button
                    onClick={handleShowTopVersion}
                    className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                    title="Ver versión principal"
                  >
                    Ver Principal ({topVersion.total_votes || 0} votos)
                  </button>
                )}
              </div>
            </div>
          ) : topVersion ? (
            <div className="bg-green-50 border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-green-700 font-medium">
                    Mostrando versión principal ({topVersion.total_votes || 0} votos)
                  </span>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
      
      <GraphLayout 
        roadmapType={roadmapType} 
        customNodes={currentVersion ? currentVersion.nodes : null}
        customEdges={currentVersion ? currentVersion.edges : null}
        readOnly={true}
        topVersion={topVersion}
      />
      <div className="mt-8 space-y-8">
        <VerifyTables />
        <DebugVersions roadmapType={roadmapType} />
        <TopVersionsSection 
          roadmapType={roadmapType} 
          onVersionSelect={handleShowVersion}
        />
        <ProposalsSection roadmapType={roadmapType} />
      </div>
    </RoadmapLayout>
  );
} 