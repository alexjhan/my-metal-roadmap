import React, { useState, useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

const TestFlow = () => {
  const initialNodes = [
    {
      id: '1',
      type: 'default',
      position: { x: 100, y: 100 },
      data: { label: 'Nodo 1' },
    },
    {
      id: '2',
      type: 'default',
      position: { x: 300, y: 100 },
      data: { label: 'Nodo 2' },
    },
    {
      id: '3',
      type: 'default',
      position: { x: 200, y: 300 },
      data: { label: 'Nodo 3' },
    },
  ];

  const initialEdges = [
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      type: 'default',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: '#3B82F6', strokeWidth: 3 }
    },
    {
      id: 'e1-3',
      source: '1',
      target: '3',
      type: 'default',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: '#10B981', strokeWidth: 3 }
    },
    {
      id: 'e2-3',
      source: '2',
      target: '3',
      type: 'default',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: '#F59E0B', strokeWidth: 3 }
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="w-full h-screen bg-gray-50">
      <div className="h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={true}
          panOnScroll={true}
          zoomOnScroll={true}
          panOnDrag={true}
          zoomOnPinch={true}
          attributionPosition="bottom-left"
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
};

export default TestFlow; 