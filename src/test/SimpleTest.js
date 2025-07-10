import React from 'react';
import ReactFlow, { MarkerType } from 'reactflow';
import 'reactflow/dist/style.css';

const SimpleTest = () => {
  const nodes = [
    {
      id: '1',
      position: { x: 100, y: 100 },
      data: { label: 'Nodo 1' },
    },
    {
      id: '2',
      position: { x: 300, y: 100 },
      data: { label: 'Nodo 2' },
    },
  ];

  const edges = [
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: '#ff0000', strokeWidth: 3 }
    },
  ];

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
      />
    </div>
  );
};

export default SimpleTest; 