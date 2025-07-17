import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GraphLayout from './GraphLayout';
import RoadmapLayout from './RoadmapLayout';
import TopVersionsSection from './TopVersionsSection';
import DebugVersions from './DebugVersions';
import VerifyTables from './VerifyTables';
import RecognitionPanel from './RecognitionPanel';
import Footer from './Footer';
import { allRoadmapsData } from '../data/allRoadmaps';
import { roadmapStorageService } from '../lib/roadmapStorage';
import { supabase } from '../lib/supabase';

export default function RoadmapPage() {
  const { roadmapType } = useParams();
  const navigate = useNavigate();
  
  // Estados para las versiones
  const [currentVersion, setCurrentVersion] = useState(null);
  const [topVersion, setTopVersion] = useState(null);
  const [authorInfo, setAuthorInfo] = useState(null);
  const [loadingTopVersion, setLoadingTopVersion] = useState(true);
  
  // Obtener datos del roadmap
  const roadmapInfo = allRoadmapsData[roadmapType];
  
  // Verificar si hay datos guardados
  // const savedData = roadmapStorageService.loadRoadmap(roadmapType);
  // const hasSavedData = savedData !== null;
  
  // Cargar la versión mejor votada
  useEffect(() => {
    const loadTopVersion = async () => {
      try {
        setLoadingTopVersion(true);
        
        const { data: version, error } = await supabase
          .from('roadmap_versions')
          .select('*')
          .eq('roadmap_type', roadmapType)
          .eq('is_public', true)
          .order('total_votes', { ascending: false })
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error cargando versión mejor votada:', error);
        } else if (version) {
          console.log('Versión mejor votada cargada:', version);
          setTopVersion(version);
          setCurrentVersion(version); // Establecer como versión actual por defecto
          
          // Los datos del autor ya están incluidos en la versión
          // No necesitamos hacer consultas adicionales
          setAuthorInfo(null); // Ya no necesitamos authorInfo separado
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

  // Función para editar una versión específica
  const handleEditVersion = (version) => {
    // Guardar los datos de la versión en localStorage para que el editor los use
    if (version && version.nodes && version.edges) {
      const versionData = {
        nodes: version.nodes,
        edges: version.edges,
        lastModified: new Date().toISOString(),
        versionId: version.id,
        versionInfo: version
      };
      
      // Guardar en localStorage con un identificador específico para esta versión
      const storageKey = `roadmap_${roadmapType}_version_${version.id}`;
      localStorage.setItem(storageKey, JSON.stringify(versionData));
      
      // Navegar al editor con parámetros para indicar que debe cargar esta versión
      navigate(`/edit/${roadmapType}?version=${version.id}`);
    }
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
    <>
      {/* Sección 1: React Flow */}
      <RoadmapLayout
        title={roadmapInfo.title}
        description={roadmapInfo.description}
        icon={roadmapInfo.icon}
        recognitionPanel={topVersion ? <RecognitionPanel topVersion={topVersion} /> : <div className="text-xs text-red-500">No hay versión mejor votada</div>}
      >
        {/* Indicador de datos guardados */}
        {/*
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
        */}
        {/* Indicador de carga */}
        {loadingTopVersion && (
          <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              <span className="text-sm text-gray-600">Cargando versión mejor votada...</span>
            </div>
          </div>
        )}
        
        <GraphLayout 
          roadmapType={roadmapType} 
          customNodes={currentVersion ? currentVersion.nodes : null}
          customEdges={currentVersion ? currentVersion.edges : null}
          readOnly={true}
        />
      </RoadmapLayout>

      {/* Sección 2: Versiones Mejor Votadas */}
      <div className="bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-8 sm:px-12 md:px-16 lg:px-20 xl:px-24">
          <TopVersionsSection 
            roadmapType={roadmapType} 
            onVersionSelect={handleShowVersion}
            onEditVersion={handleEditVersion}
          />
        </div>
      </div>

    </>
  );
} 