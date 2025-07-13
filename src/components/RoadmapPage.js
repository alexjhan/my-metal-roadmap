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
  
  // Estados para la versión mejor votada
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
          .select('*')
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
        }
      } catch (error) {
        console.error('Error cargando versión mejor votada:', error);
      } finally {
        setLoadingTopVersion(false);
      }
    };

    loadTopVersion();
  }, [roadmapType]);
  
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
      
      <GraphLayout roadmapType={roadmapType} />
      <div className="mt-8 space-y-8">
        <VerifyTables />
        <DebugVersions roadmapType={roadmapType} />
        <TopVersionsSection roadmapType={roadmapType} />
        <ProposalsSection roadmapType={roadmapType} />
      </div>
    </RoadmapLayout>
  );
} 