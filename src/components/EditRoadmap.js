import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useNavigate, useParams } from 'react-router-dom';

import CustomNode from './CustomNode';
import { nodes as termodinamicaNodes } from '../data/nodes';
import { edges as termodinamicaEdges } from '../data/edges';

const nodeTypes = {
  custom: (props) => <CustomNode {...props} onClick={() => props.data.onNodeClick(props.id)} />,
};

function FlowWithFitView() {
  const { fitView } = useReactFlow();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      fitView({ 
        padding: 0.2, 
        includeHiddenNodes: false,
        duration: 800 
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [fitView]);

  return null;
}

// Mapeo de roadmaps a sus datos
const roadmapData = {
  'termodinamica': {
    title: 'Termodinámica',
    nodes: termodinamicaNodes,
    edges: termodinamicaEdges,
    icon: '🔥'
  },
  // Aquí puedes agregar más roadmaps en el futuro
  // 'matematicas': {
  //   title: 'Matemáticas',
  //   nodes: matematicasNodes,
  //   edges: matematicasEdges,
  //   icon: '📐'
  // }
};

const EditRoadmap = () => {
  const { roadmapType } = useParams();
  const navigate = useNavigate();
  
  console.log('EditRoadmap component rendering for:', roadmapType);
  
  // Obtener datos del roadmap
  const roadmapInfo = roadmapData[roadmapType];
  
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

  const [nodes, setNodes, onNodesChange] = useNodesState(roadmapInfo.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    roadmapInfo.edges.map(edge => ({
      ...edge,
      markerEnd: { type: MarkerType.ArrowClosed }
    }))
  );
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);

  console.log('EditRoadmap state:', { 
    roadmapType, 
    nodes: nodes.length, 
    edges: edges.length 
  });

  // Pasar función de click a cada nodo
  const nodesWithClick = nodes.map(node => ({
    ...node,
    data: {
      ...node.data,
      onNodeClick: (id) => setSelectedNodeId(id),
    },
  }));

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  const handleSave = () => {
    setShowSaveModal(true);
    console.log('Saving changes for roadmap:', roadmapType);
    // Aquí puedes implementar la lógica para guardar los cambios
    setTimeout(() => {
      setShowSaveModal(false);
      alert('Cambios guardados exitosamente');
    }, 2000);
  };

  const handleCancel = () => {
    if (window.confirm('¿Estás seguro de que quieres cancelar? Los cambios no guardados se perderán.')) {
      navigate(`/${roadmapType}`);
    }
  };

  return (
    <div className="w-full h-screen bg-gray-50">
      {/* Header de edición */}
      <div className="bg-white shadow-md border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(`/${roadmapType}`)}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{roadmapInfo.icon}</span>
              <h1 className="text-xl font-bold text-gray-900">Editando: {roadmapInfo.title}</h1>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>

      {/* Área de edición */}
      <div className="h-full">
        <ReactFlow
          nodes={nodesWithClick}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView={false}
          fitViewOptions={{ padding: 0.2, includeHiddenNodes: false }}
          defaultViewport={{ x: 0, y: 0, zoom: 0.6 }}
          minZoom={0.1}
          maxZoom={2}
          nodesDraggable={true}
          nodesConnectable={true}
          elementsSelectable={true}
          panOnScroll={false}
          zoomOnScroll={false}
          panOnDrag={true}
          zoomOnPinch={true}
          panOnScrollMode="free"
          attributionPosition="bottom-left"
          preventScrolling={false}
          zoomOnDoubleClick={false}
          multiSelectionKeyCode={null}
          deleteKeyCode="Delete"
        >
          <FlowWithFitView />
          <Controls />
          <Background 
            variant="lines" 
            gap={20} 
            size={1} 
            color="#e5e7eb"
            style={{ backgroundColor: '#f9fafb' }}
          />
        </ReactFlow>
      </div>

      {/* Modal de guardado */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <p className="text-gray-700">Guardando cambios...</p>
            </div>
          </div>
        </div>
      )}

      {/* Instrucciones de edición */}
      <div className="fixed bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-sm">
        <h3 className="font-semibold text-gray-900 mb-2">Instrucciones de Edición:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Arrastra los nodos para moverlos</li>
          <li>• Conecta nodos arrastrando desde uno a otro</li>
          <li>• Selecciona y elimina conexiones con Delete</li>
          <li>• Haz clic en "Guardar Cambios" cuando termines</li>
        </ul>
      </div>

      {/* Información de debug */}
      <div className="fixed top-20 right-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
        <h3 className="font-semibold text-gray-900 mb-2">Debug Info:</h3>
        <p className="text-xs text-gray-600">Roadmap: {roadmapType}</p>
        <p className="text-xs text-gray-600">Nodos: {nodes.length}</p>
        <p className="text-xs text-gray-600">Conexiones: {edges.length}</p>
        <p className="text-xs text-gray-600">Nodo seleccionado: {selectedNodeId || 'Ninguno'}</p>
      </div>
    </div>
  );
};

export default EditRoadmap; 