import React from 'react';
import GraphLayout from './GraphLayout';
import RoadmapLayout from './RoadmapLayout';
import ProposalsSection from './ProposalsSection';

export default function TermodinamicaPage() {
  return (
    <RoadmapLayout
      title="Termodinámica Metalúrgica"
      description="Mapa mental interactivo de conceptos fundamentales de termodinámica aplicada a procesos metalúrgicos"
      icon="🔥"
    >
      <GraphLayout />
      <div className="mt-8">
        <ProposalsSection roadmapType="termodinamica" />
      </div>
    </RoadmapLayout>
  );
} 