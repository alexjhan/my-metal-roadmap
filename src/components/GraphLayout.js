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

import CustomNode from './CustomNode';
import useLayout from '../hooks/useLayout';
import { nodes as initialNodes } from '../data/nodes';
import { edges as initialEdges } from '../data/edges';

const nodeTypes = {
  custom: (props) => <CustomNode {...props} onClick={() => props.data.onNodeClick(props.id)} />,
};

function NodeDrawer({ node, onClose }) {
  if (!node) return null;
  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-[200] transition-opacity duration-300"
        onClick={onClose}
      />
      {/* Drawer lateral */}
      <div className="fixed top-0 right-0 h-screen w-full sm:w-[420px] bg-white z-[210] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{node.data.icon}</span>
            <h3 className="text-lg font-bold text-gray-900">{node.data.label}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Descripción</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {node.data.description}
              </p>
            </div>
            {node.data.link && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Enlace</h4>
                <a
                  href={node.data.link}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Ver más detalles
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

const GraphLayout = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    initialEdges.map(edge => ({
      ...edge,
      markerEnd: { type: MarkerType.ArrowClosed }
    }))
  );
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  // Pasar función de click a cada nodo
  const nodesWithClick = nodes.map(node => ({
    ...node,
    data: {
      ...node.data,
      onNodeClick: (id) => setSelectedNodeId(id),
    },
  }));

  // Layout radial
  useLayout(nodes, edges, setNodes);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  return (
    <div className="w-full h-full relative">
      <div className="h-full">
        <ReactFlow
          nodes={nodesWithClick}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.1, includeHiddenNodes: false }}
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
          minZoom={0.1}
          maxZoom={2}
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
          <MiniMap 
            nodeStrokeColor={(n) => {
              if (n.type === 'custom') return '#3B82F6';
              return '#6B7280';
            }}
            nodeColor={(n) => {
              if (n.type === 'custom') return '#DBEAFE';
              return '#F3F4F6';
            }}
          />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>
      {/* Drawer lateral fullscreen */}
      <NodeDrawer node={selectedNode} onClose={() => setSelectedNodeId(null)} />
    </div>
  );
};

export default GraphLayout; 