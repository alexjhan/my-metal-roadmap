import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GraphLayout from './GraphLayout';
import RoadmapLayout from './RoadmapLayout';
import ProposalsSection from './ProposalsSection';
import { allRoadmapsData } from '../data/allRoadmaps';

export default function RoadmapPage() {
  const { roadmapType } = useParams();
  const navigate = useNavigate();
  
  // Obtener datos del roadmap
  const roadmapInfo = allRoadmapsData[roadmapType];
  
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
      <GraphLayout roadmapType={roadmapType} />
      <div className="mt-8">
        <ProposalsSection roadmapType={roadmapType} />
      </div>
    </RoadmapLayout>
  );
} 