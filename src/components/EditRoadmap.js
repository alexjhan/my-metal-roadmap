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
  Panel,
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

// Panel de herramientas lateral
const ToolbarPanel = ({ onAddNode, onSave, onCancel, roadmapInfo }) => {
  return (
    <div className="fixed left-4 top-4 bottom-4 w-64 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{roadmapInfo.icon}</span>
          <div>
            <h2 className="font-semibold text-gray-900">Editando</h2>
            <p className="text-sm text-gray-600">{roadmapInfo.title}</p>
          </div>
        </div>
      </div>

      {/* Herramientas */}
      <div className="flex-1 p-4 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Herramientas</h3>
          <div className="space-y-2">
            <button
              onClick={onAddNode}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Agregar Nodo</span>
            </button>
            <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span>Conectar Nodos</span>
            </button>
            <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <span>Organizar</span>
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Vista</h3>
          <div className="space-y-2">
            <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Buscar</span>
            </button>
            <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Centrar Vista</span>
            </button>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <button
          onClick={onSave}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Guardar Cambios
        </button>
        <button
          onClick={onCancel}
          className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

// Panel de propiedades del nodo seleccionado
const PropertiesPanel = ({ selectedNode, onUpdateNode }) => {
  if (!selectedNode) {
    return (
      <div className="fixed right-4 top-4 bottom-4 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Propiedades</h3>
        <p className="text-gray-500 text-sm">Selecciona un nodo para editar sus propiedades</p>
      </div>
    );
  }

  return (
    <div className="fixed right-4 top-4 bottom-4 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Propiedades del Nodo</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
          <input
            type="text"
            value={selectedNode.data.label}
            onChange={(e) => onUpdateNode(selectedNode.id, 'label', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
          <textarea
            value={selectedNode.data.description}
            onChange={(e) => onUpdateNode(selectedNode.id, 'description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Icono</label>
          <input
            type="text"
            value={selectedNode.data.icon}
            onChange={(e) => onUpdateNode(selectedNode.id, 'icon', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="🔥"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Posición X</label>
            <input
              type="number"
              value={selectedNode.position.x}
              onChange={(e) => onUpdateNode(selectedNode.id, 'positionX', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Posición Y</label>
            <input
              type="number"
              value={selectedNode.position.y}
              onChange={(e) => onUpdateNode(selectedNode.id, 'positionY', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
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

  const handleAddNode = () => {
    const newNode = {
      id: `node-${Date.now()}`,
      type: 'custom',
      position: { x: 100, y: 100 },
      data: {
        label: 'Nuevo Nodo',
        description: 'Descripción del nuevo nodo',
        icon: '📝',
        onNodeClick: (id) => setSelectedNodeId(id),
      }
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const handleUpdateNode = (nodeId, property, value) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          if (property === 'positionX') {
            return { ...node, position: { ...node.position, x: value } };
          } else if (property === 'positionY') {
            return { ...node, position: { ...node.position, y: value } };
          } else {
            return { ...node, data: { ...node.data, [property]: value } };
          }
        }
        return node;
      })
    );
  };

  return (
    <div className="w-full h-screen bg-gray-50">
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
            variant="dots" 
            gap={20} 
            size={1} 
            color="#e5e7eb"
            style={{ backgroundColor: '#f9fafb' }}
          />
        </ReactFlow>
      </div>

      {/* Panel de herramientas lateral */}
      <ToolbarPanel 
        onAddNode={handleAddNode}
        onSave={handleSave}
        onCancel={handleCancel}
        roadmapInfo={roadmapInfo}
      />

      {/* Panel de propiedades */}
      <PropertiesPanel 
        selectedNode={selectedNode}
        onUpdateNode={handleUpdateNode}
      />

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

      {/* Barra de estado */}
      <div className="fixed bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>Nodos: {nodes.length}</span>
            <span>Conexiones: {edges.length}</span>
            <span>Roadmap: {roadmapType}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-600">●</span>
            <span>Guardado automático</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRoadmap; 