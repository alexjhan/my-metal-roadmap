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
import { useUser } from '../UserContext';
import { roadmapStorage } from '../lib/roadmapStorage';
import { proposalService } from '../lib/roadmapStorage';
import EditProposal from './EditProposal';
import LiveView from './LiveView';

import CustomNode from './CustomNode';
import { nodes as termodinamicaNodes } from '../data/nodes';
import { edges as termodinamicaEdges } from '../data/edges';

// Datos de roadmaps
const roadmapData = {
  termodinamica: {
    title: "Termodinámica Metalúrgica",
    description: "Mapa mental interactivo de conceptos fundamentales de termodinámica aplicada a procesos metalúrgicos",
    icon: "🔥",
    nodes: termodinamicaNodes,
    edges: termodinamicaEdges
  }
};

const nodeTypes = {
  custom: CustomNode,
};

function FlowWithFitView() {
  const { fitView } = useReactFlow();
  useEffect(() => {
    fitView({ padding: 0.2 });
  }, [fitView]);
  return null;
}

// Componentes disponibles para el roadmap
const availableComponents = [
  {
    id: 'main-title',
    name: 'Título Principal',
    icon: '📋',
    description: 'Título principal del concepto',
    type: 'main-title',
    defaultData: {
      label: 'Nuevo Título Principal',
      description: 'Descripción del título principal',
      icon: '📋',
      backgroundColor: '#3B82F6',
      fontSize: '24px',
      fontWeight: 'bold'
    }
  },
  {
    id: 'subtitle',
    name: 'Subtítulo',
    icon: '📝',
    description: 'Subtítulo o categoría',
    type: 'subtitle',
    defaultData: {
      label: 'Nuevo Subtítulo',
      description: 'Descripción del subtítulo',
      icon: '📝',
      backgroundColor: '#10B981',
      fontSize: '18px',
      fontWeight: 'semibold'
    }
  },
  {
    id: 'concept',
    name: 'Concepto',
    icon: '💡',
    description: 'Concepto o idea principal',
    type: 'concept',
    defaultData: {
      label: 'Nuevo Concepto',
      description: 'Descripción del concepto',
      icon: '💡',
      backgroundColor: '#F59E0B',
      fontSize: '16px',
      fontWeight: 'normal'
    }
  },
  {
    id: 'type',
    name: 'Tipo',
    icon: '🏷️',
    description: 'Clasificación o tipo',
    type: 'type',
    defaultData: {
      label: 'Nuevo Tipo',
      description: 'Descripción del tipo',
      icon: '🏷️',
      backgroundColor: '#8B5CF6',
      fontSize: '14px',
      fontWeight: 'normal'
    }
  },
  {
    id: 'comment',
    name: 'Comentario',
    icon: '💬',
    description: 'Nota o comentario adicional',
    type: 'comment',
    defaultData: {
      label: 'Nuevo Comentario',
      description: 'Descripción del comentario',
      icon: '💬',
      backgroundColor: '#6B7280',
      fontSize: '12px',
      fontWeight: 'normal'
    }
  },
  {
    id: 'formula',
    name: 'Fórmula',
    icon: '🧮',
    description: 'Fórmula matemática',
    type: 'formula',
    defaultData: {
      label: 'Nueva Fórmula',
      description: 'Descripción de la fórmula',
      icon: '🧮',
      backgroundColor: '#EF4444',
      fontSize: '14px',
      fontWeight: 'normal'
    }
  },
  {
    id: 'process',
    name: 'Proceso',
    icon: '⚙️',
    description: 'Proceso o procedimiento',
    type: 'process',
    defaultData: {
      label: 'Nuevo Proceso',
      description: 'Descripción del proceso',
      icon: '⚙️',
      backgroundColor: '#06B6D4',
      fontSize: '16px',
      fontWeight: 'normal'
    }
  }
];

const EditRoadmap = () => {
  const { roadmapType } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  
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
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle');
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [proposals, setProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [proposalDescription, setProposalDescription] = useState('');
  const [showLiveView, setShowLiveView] = useState(false);
  const [searchComponents, setSearchComponents] = useState('');
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(false);

  console.log('EditRoadmap state:', { 
    roadmapType, 
    nodes: nodes.length, 
    edges: edges.length 
  });

  // Cargar propuestas existentes
  useEffect(() => {
    const loadProposals = async () => {
      try {
        const proposalsData = await proposalService.getProposals(roadmapType);
        setProposals(proposalsData);
      } catch (error) {
        console.error('Error loading proposals:', error);
      }
    };

    loadProposals();
  }, [roadmapType]);

  // Pasar función de click a cada nodo
  const nodesWithClick = nodes.map(node => ({
    ...node,
    data: {
      ...node.data,
      onNodeClick: handleNodeClick,
      onSave: (nodeData) => {
        console.log('Saving node data:', nodeData);
        setHasUnsavedChanges(true);
        setNodes((nds) =>
          nds.map((n) => {
            if (n.id === node.id) {
              return {
                ...n,
                data: {
                  ...n.data,
                  ...nodeData
                }
              };
            }
            return n;
          })
        );
      },
      onUpdateResources: (type, value) => {
        console.log('Updating resources:', type, value);
        setHasUnsavedChanges(true);
        setNodes((nds) =>
          nds.map((n) => {
            if (n.id === node.id) {
              return {
                ...n,
                data: {
                  ...n.data,
                  [`${type}Resources`]: value
                }
              };
            }
            return n;
          })
        );
      }
    },
  }));

  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge(params, eds));
      setHasUnsavedChanges(true);
    },
    [setEdges]
  );

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  const handleCreateProposal = async () => {
    if (!user) {
      alert('Debes iniciar sesión para crear propuestas');
      return;
    }

    if (!proposalDescription.trim()) {
      alert('Debes agregar una descripción para la propuesta');
      return;
    }

    setSaveStatus('saving');
    setShowProposalModal(true);

    try {
      // Crear propuesta de edición
      const changes = [];

      // Detectar cambios en nodos
      nodes.forEach(node => {
        const originalNode = roadmapInfo.nodes.find(n => n.id === node.id);
        if (originalNode && JSON.stringify(originalNode.data) !== JSON.stringify(node.data)) {
          changes.push({
            type: 'node',
            nodeId: node.id,
            action: 'update',
            before: originalNode.data,
            after: node.data
          });
        }
      });

      // Detectar nuevas conexiones
      const newConnections = edges.filter(edge => !roadmapInfo.edges.find(e => e.id === edge.id));
      newConnections.forEach(connection => {
        changes.push({
          type: 'connection',
          action: 'add',
          before: null,
          after: connection
        });
      });

      if (changes.length === 0) {
        alert('No hay cambios para proponer');
        setSaveStatus('idle');
        setShowProposalModal(false);
        return;
      }

      await proposalService.createProposal(roadmapType, user.id, changes, proposalDescription);
      
      setSaveStatus('saved');
      setHasUnsavedChanges(false);
      setProposalDescription('');
      
      setTimeout(async () => {
        setShowProposalModal(false);
        setSaveStatus('idle');
        // Recargar propuestas
        const proposalsData = await proposalService.getProposals(roadmapType);
        setProposals(proposalsData);
      }, 2000);
    } catch (error) {
      console.error('Error saving changes:', error);
      setSaveStatus('error');
      alert('Error al crear la propuesta: ' + error.message);
    }
  };

  const handleVote = async (proposalId, vote, comment) => {
    try {
      await proposalService.voteOnProposal(proposalId, user.id, vote, comment);
      // Recargar propuestas
      const proposalsData = await proposalService.getProposals(roadmapType);
      setProposals(proposalsData);
    } catch (error) {
      console.error('Error voting on proposal:', error);
      alert('Error al votar: ' + error.message);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('¿Estás seguro de que quieres cancelar? Los cambios no guardados se perderán.')) {
        navigate(`/${roadmapType}`);
      }
    } else {
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
        description: 'Descripción del nodo',
        icon: '📝',
        backgroundColor: '#3B82F6',
        freeResources: [],
        premiumResources: []
      }
    };
    setNodes((nds) => [...nds, newNode]);
    setHasUnsavedChanges(true);
  };

  const handleAddComponent = (component) => {
    const newNode = {
      id: `node-${Date.now()}`,
      type: 'custom',
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      data: {
        ...component.defaultData,
        freeResources: [],
        premiumResources: []
      }
    };
    setNodes((nds) => [...nds, newNode]);
    setHasUnsavedChanges(true);
  };

  const handleUpdateNode = (nodeId, property, value) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === nodeId) {
          if (property === 'positionX') {
            return { ...n, position: { ...n.position, x: value } };
          } else if (property === 'positionY') {
            return { ...n, position: { ...n.position, y: value } };
          } else {
            return {
              ...n,
              data: {
                ...n.data,
                [property]: value
              }
            };
          }
        }
        return n;
      })
    );
    setHasUnsavedChanges(true);
  };

  const handleDeleteNode = (nodeId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este nodo?')) {
      setNodes((nds) => nds.filter(n => n.id !== nodeId));
      setEdges((eds) => eds.filter(e => e.source !== nodeId && e.target !== nodeId));
      setSelectedNodeId(null);
      setShowPropertiesPanel(false);
      setHasUnsavedChanges(true);
    }
  };

  const handleDuplicateNode = (nodeId) => {
    const nodeToDuplicate = nodes.find(n => n.id === nodeId);
    if (nodeToDuplicate) {
      const newNode = {
        ...nodeToDuplicate,
        id: `node-${Date.now()}`,
        position: {
          x: nodeToDuplicate.position.x + 50,
          y: nodeToDuplicate.position.y + 50
        },
        data: {
          ...nodeToDuplicate.data,
          label: `${nodeToDuplicate.data.label} (copia)`
        }
      };
      setNodes((nds) => [...nds, newNode]);
      setHasUnsavedChanges(true);
    }
  };

  const handleNodeClick = (id) => {
    setSelectedNodeId(id);
    setShowPropertiesPanel(true);
    // Scroll suave al panel si está en móvil
    if (window.innerWidth < 768) {
      setTimeout(() => {
        const panel = document.querySelector('.properties-panel');
        if (panel) {
          panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
    }
  };

  // Filtrar componentes basado en la búsqueda
  const filteredComponents = availableComponents.filter(component =>
    component.name.toLowerCase().includes(searchComponents.toLowerCase()) ||
    component.description.toLowerCase().includes(searchComponents.toLowerCase())
  );

  return (
    <div className="w-full h-screen bg-gray-50 flex flex-col">
      {/* Header Superior */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        {/* Izquierda - Título y descripción */}
        <div className="flex items-center space-x-4">
          <span className="text-3xl">{roadmapInfo.icon}</span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{roadmapInfo.title}</h1>
            <p className="text-sm text-gray-600">{roadmapInfo.description}</p>
          </div>
        </div>

        {/* Derecha - Botones de acción */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowLiveView(!showLiveView)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>Live View</span>
          </button>
          <button
            onClick={handleCreateProposal}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            <span>Guardar Roadmap</span>
          </button>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 flex">
        {/* Panel Izquierdo - Componentes */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Búsqueda de componentes */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar componentes..."
                value={searchComponents}
                onChange={(e) => setSearchComponents(e.target.value)}
                className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Lista de componentes */}
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Componentes Disponibles</h3>
            <div className="space-y-2">
              {filteredComponents.map((component) => (
                <div
                  key={component.id}
                  className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
                  onClick={() => handleAddComponent(component)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{component.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{component.name}</h4>
                      <p className="text-sm text-gray-600">{component.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Área de edición */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodesWithClick}
            edges={edges}
            onNodesChange={(changes) => {
              onNodesChange(changes);
              setHasUnsavedChanges(true);
            }}
            onEdgesChange={(changes) => {
              onEdgesChange(changes);
              setHasUnsavedChanges(true);
            }}
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

        {/* Panel Derecho - Propiedades (desplegable) */}
        {showPropertiesPanel && selectedNode && (
          <div className="w-96 bg-white border-l border-gray-200 flex flex-col properties-panel">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Editar Nodo</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDuplicateNode(selectedNode.id)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Duplicar nodo"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteNode(selectedNode.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Eliminar nodo"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setShowPropertiesPanel(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                ID: {selectedNode.id}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Columna Izquierda - Propiedades */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Propiedades</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                    <input
                      type="text"
                      value={selectedNode.data.label}
                      onChange={(e) => handleUpdateNode(selectedNode.id, 'label', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Icono</label>
                    <input
                      type="text"
                      value={selectedNode.data.icon}
                      onChange={(e) => handleUpdateNode(selectedNode.id, 'icon', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="🔥"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Color de Fondo</label>
                    <input
                      type="color"
                      value={selectedNode.data.backgroundColor}
                      onChange={(e) => handleUpdateNode(selectedNode.id, 'backgroundColor', e.target.value)}
                      className="w-full h-10 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tamaño de Fuente</label>
                    <select
                      value={selectedNode.data.fontSize || '16px'}
                      onChange={(e) => handleUpdateNode(selectedNode.id, 'fontSize', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="12px">Pequeño (12px)</option>
                      <option value="14px">Mediano (14px)</option>
                      <option value="16px">Normal (16px)</option>
                      <option value="18px">Grande (18px)</option>
                      <option value="20px">Muy Grande (20px)</option>
                      <option value="24px">Título (24px)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Peso de Fuente</label>
                    <select
                      value={selectedNode.data.fontWeight || 'normal'}
                      onChange={(e) => handleUpdateNode(selectedNode.id, 'fontWeight', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="normal">Normal</option>
                      <option value="semibold">Semibold</option>
                      <option value="bold">Bold</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Posición X</label>
                      <input
                        type="number"
                        value={selectedNode.position.x}
                        onChange={(e) => handleUpdateNode(selectedNode.id, 'positionX', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Posición Y</label>
                      <input
                        type="number"
                        value={selectedNode.position.y}
                        onChange={(e) => handleUpdateNode(selectedNode.id, 'positionY', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Columna Derecha - Contenido y Links */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Contenido y Links</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                    <textarea
                      value={selectedNode.data.description}
                      onChange={(e) => handleUpdateNode(selectedNode.id, 'description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Recursos Gratuitos</label>
                    <textarea
                      value={selectedNode.data.freeResources?.join('\n') || ''}
                      onChange={(e) => handleUpdateNode(selectedNode.id, 'freeResources', e.target.value.split('\n').filter(line => line.trim()))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Un recurso por línea..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Recursos Premium</label>
                    <textarea
                      value={selectedNode.data.premiumResources?.join('\n') || ''}
                      onChange={(e) => handleUpdateNode(selectedNode.id, 'premiumResources', e.target.value.split('\n').filter(line => line.trim()))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Un recurso por línea..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                    <input
                      type="text"
                      value={selectedNode.data.tags?.join(', ') || ''}
                      onChange={(e) => handleUpdateNode(selectedNode.id, 'tags', e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="tag1, tag2, tag3..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de propuesta */}
      {showProposalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="flex items-center space-x-3">
              {saveStatus === 'saving' && (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  <p className="text-gray-700">Creando propuesta...</p>
                </>
              )}
              {saveStatus === 'saved' && (
                <>
                  <div className="text-green-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700">¡Propuesta creada exitosamente!</p>
                </>
              )}
              {saveStatus === 'error' && (
                <>
                  <div className="text-red-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="text-gray-700">Error al crear propuesta</p>
                </>
              )}
            </div>
            {saveStatus === 'idle' && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción de la propuesta:
                </label>
                <textarea
                  value={proposalDescription}
                  onChange={(e) => setProposalDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Describe los cambios que propones..."
                />
                <div className="mt-4 flex space-x-3">
                  <button
                    onClick={() => setShowProposalModal(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleCreateProposal}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Crear Propuesta
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de propuesta seleccionada */}
      {selectedProposal && (
        <EditProposal
          proposal={selectedProposal}
          onVote={handleVote}
          onClose={() => setSelectedProposal(null)}
        />
      )}

      {/* Live View */}
      {showLiveView && (
        <LiveView
          nodes={nodes}
          edges={edges}
          roadmapInfo={roadmapInfo}
          onClose={() => setShowLiveView(false)}
        />
      )}

      {/* Barra de estado */}
      <div className="bg-white border-t border-gray-200 p-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>Nodos: {nodes.length}</span>
            <span>Conexiones: {edges.length}</span>
            <span>Roadmap: {roadmapType}</span>
            {hasUnsavedChanges && (
              <span className="text-orange-600 font-medium">● Cambios sin guardar</span>
            )}
            <span>Propuestas: {proposals.filter(p => p.status === 'pending').length}</span>
          </div>
          <div className="flex items-center space-x-2">
            {saveStatus === 'saved' ? (
              <>
                <span className="text-green-600">●</span>
                <span>Propuesta creada</span>
              </>
            ) : hasUnsavedChanges ? (
              <>
                <span className="text-orange-600">●</span>
                <span>Cambios pendientes</span>
              </>
            ) : (
              <>
                <span className="text-gray-400">●</span>
                <span>Sin cambios</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRoadmap; 