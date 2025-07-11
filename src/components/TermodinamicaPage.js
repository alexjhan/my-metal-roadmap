import React from 'react';
import GraphLayout from './GraphLayout';
import RoadmapLayout from './RoadmapLayout';

export default function TermodinamicaPage() {
  return (
    <RoadmapLayout
      title="Termodinámica Metalúrgica"
      description="Mapa mental interactivo de conceptos fundamentales de termodinámica aplicada a procesos metalúrgicos"
      icon="🔥"
    >
      <GraphLayout />
    </RoadmapLayout>
  );
} 