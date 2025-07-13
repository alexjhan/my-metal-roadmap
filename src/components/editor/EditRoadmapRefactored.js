import React, { useState, useCallback, useEffect, useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  useReactFlow,
  getBezierPath,
  getStraightPath,
  getSmoothStepPath,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../../UserContext';
import { roadmapStorage } from '../../lib/roadmapStorage';
import { proposalService } from '../../lib/roadmapStorage';
import EditProposal from '../EditProposal';
import LiveView from '../LiveView';
import CustomNode from '../CustomNode';
import { nodes as termodinamicaNodes } from '../../data/nodes';
import { edges as termodinamicaEdges } from '../../data/edges';
import { allRoadmapsData } from '../../data/allRoadmaps';
import { devConfig } from '../../config/dev';

// Importar componentes del editor
import EditorHeader from './EditorHeader';
import Sidebar from './Sidebar';
import ComponentsPanel from './ComponentsPanel';
import ToolsPanel from './ToolsPanel';
import PropertiesPanel from './PropertiesPanel';
import { availableComponents, allRoadmaps } from './constants';

// Modo de desarrollo - permite acceso sin autenticación en localhost
const isDevelopment = devConfig.isDevelopment;

// Edge types personalizados
const StraightEdge = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, markerEnd, markerStart }) => {
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <path
      id={id}
      style={style}
      className="react-flow__edge-path"
      d={edgePath}
      markerEnd={markerEnd}
      markerStart={markerStart}
    />
  );
};

const AngleEdge = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, markerEnd, markerStart }) => {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <path
      id={id}
      style={style}
      className="react-flow__edge-path"
      d={edgePath}
      markerEnd={markerEnd}
      markerStart={markerStart}
    />
  );
};

const CurvedEdge = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, markerEnd, markerStart }) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <path
      id={id}
      style={style}
      className="react-flow__edge-path"
      d={edgePath}
      markerEnd={markerEnd}
      markerStart={markerStart}
    />
  );
};

// Datos de roadmaps
const roadmapData = allRoadmapsData;

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  straight: StraightEdge,
  angle: AngleEdge,
  curved: CurvedEdge,
};

function FlowWithFitView() {
  const { fitView } = useReactFlow();
  useEffect(() => {
    fitView({ padding: 0.2 });
  }, [fitView]);
  return null;
}

const EditRoadmapRefactored = () => {
  const { roadmapType } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  
  // Obtener datos del roadmap
  const roadmapInfo = useMemo(() => roadmapData[roadmapType], [roadmapType]);
  
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

  // Estados principales
  const [nodes, setNodes, onNodesChange] = useNodesState(roadmapInfo.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    roadmapInfo.edges.map(edge => ({
      ...edge,
      type: 'straight', // Tipo por defecto
      markerEnd: { 
        type: MarkerType.ArrowClosed,
        color: '#1e3a8a' // Color inicial de la flecha
      },
      style: { stroke: '#1e3a8a', strokeWidth: 3 }
    }))
  );
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle');
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [proposals, setProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [proposalDescription, setProposalDescription] = useState('');
  const [showLiveView, setShowLiveView] = useState(false);
  const [searchComponents, setSearchComponents] = useState('');
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(false);
  const [showComponentsPanel, setShowComponentsPanel] = useState(false);
  const [showRoadmapsPanel, setShowRoadmapsPanel] = useState(false);
  const [searchRoadmaps, setSearchRoadmaps] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTitle, setEditTitle] = useState(roadmapInfo.title);
  const [editDescription, setEditDescription] = useState(roadmapInfo.description);
  const [propertiesTab, setPropertiesTab] = useState('properties');
  const [showToolsPanel, setShowToolsPanel] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [presentationMode, setPresentationMode] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [autoLayout, setAutoLayout] = useState(false);

  // Filtrar roadmaps basado en la búsqueda
  const filteredRoadmaps = useMemo(() => 
    allRoadmaps.filter(roadmap =>
      roadmap.title.toLowerCase().includes(searchRoadmaps.toLowerCase()) ||
      roadmap.description.toLowerCase().includes(searchRoadmaps.toLowerCase())
    ), [searchRoadmaps]
  );

  // Filtrar componentes basado en la búsqueda
  const filteredComponents = useMemo(() => 
    availableComponents.filter(component =>
      component.name.toLowerCase().includes(searchComponents.toLowerCase()) ||
      component.description.toLowerCase().includes(searchComponents.toLowerCase())
    ), [searchComponents]
  );

  // Obtener nodo y flecha seleccionados
  const selectedNode = useMemo(() => 
    selectedNodeId ? nodes.find(node => node.id === selectedNodeId) : null
  , [selectedNodeId, nodes]);

  const selectedEdge = useMemo(() => 
    selectedEdgeId ? edges.find(edge => edge.id === selectedEdgeId) : null
  , [selectedEdgeId, edges]);

  // Cargar propuestas existentes
  useEffect(() => {
    const loadProposals = async () => {
      // En modo desarrollo, no cargar propuestas de Supabase
      if (isDevelopment) {
        console.log('Modo desarrollo: omitiendo carga de propuestas de Supabase');
        return;
      }

      try {
        const proposalsData = await proposalService.getProposals(roadmapType);
        setProposals(proposalsData);
      } catch (error) {
        console.error('Error loading proposals:', error);
      }
    };

    loadProposals();
  }, [roadmapType, isDevelopment]);

  // Handlers principales
  const handleNodeClick = useCallback((id) => {
    setSelectedNodeId(id);
    setSelectedEdgeId(null);
    setShowPropertiesPanel(true);
  }, []);

  const handleEdgeClick = useCallback((event, edge) => {
    setSelectedEdgeId(edge.id);
    setSelectedNodeId(null);
    setShowPropertiesPanel(true);
  }, []);

  const handleUpdateEdge = useCallback((edgeId, property, value) => {
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === edgeId) {
          const updatedEdge = { ...edge, [property]: value };
          
          // Si se está actualizando el lineStyle, también actualizar el tipo de edge
          if (property === 'data' && value.lineStyle) {
            updatedEdge.type = value.lineStyle;
          }
          
          // Si se está actualizando el color de la línea, también actualizar el color de la flecha
          if (property === 'style' && value.stroke) {
            updatedEdge.markerEnd = {
              ...updatedEdge.markerEnd,
              color: value.stroke
            };
          }
          
          return updatedEdge;
        }
        return edge;
      })
    );
    setHasUnsavedChanges(true);
  }, [setEdges]);

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = document.querySelector('.react-flow').getBoundingClientRect();
      const data = event.dataTransfer.getData('application/json');

      if (typeof data === 'undefined' || !data) {
        return;
      }

      const component = JSON.parse(data);
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode = {
        id: `${component.type}-${Date.now()}`,
        type: 'custom',
        position,
        data: {
          ...component.defaultData,
          label: component.defaultData.label,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleCreateProposal = useCallback(async () => {
    if (!isDevelopment && !user) {
      alert('Debes iniciar sesión para crear propuestas');
      return;
    }

    if (!proposalDescription.trim()) {
      alert('Debes agregar una descripción para la propuesta');
      return;
    }

    // En modo desarrollo, simular la creación de propuesta
    if (isDevelopment) {
      console.log('Modo desarrollo: simulando creación de propuesta');
      setSaveStatus('saved');
      setHasUnsavedChanges(false);
      setProposalDescription('');
      
      setTimeout(() => {
        setShowProposalModal(false);
        setSaveStatus('idle');
      }, 2000);
      return;
    }

    setSaveStatus('saving');
    setShowProposalModal(true);

    try {
      const changes = [];
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

      const userId = isDevelopment ? devConfig.devUser.id : user.id;
      await proposalService.createProposal(roadmapType, userId, changes, proposalDescription);
      
      setSaveStatus('saved');
      setHasUnsavedChanges(false);
      setProposalDescription('');
      
      setTimeout(async () => {
        setShowProposalModal(false);
        setSaveStatus('idle');
        const proposalsData = await proposalService.getProposals(roadmapType);
        setProposals(proposalsData);
      }, 2000);
    } catch (error) {
      console.error('Error saving changes:', error);
      setSaveStatus('error');
      alert('Error al crear la propuesta: ' + error.message);
    }
  }, [isDevelopment, user, proposalDescription, nodes, edges, roadmapInfo, roadmapType]);

  const handleVote = useCallback(async (proposalId, vote, comment) => {
    try {
      const userId = isDevelopment ? devConfig.devUser.id : user.id;
      await proposalService.voteOnProposal(proposalId, userId, vote, comment);
      const proposalsData = await proposalService.getProposals(roadmapType);
      setProposals(proposalsData);
    } catch (error) {
      console.error('Error voting on proposal:', error);
      alert('Error al votar: ' + error.message);
    }
  }, [isDevelopment, user, roadmapType]);

  // Handlers de componentes
  const handleAddComponent = useCallback((component) => {
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
  }, [setNodes]);

  const handleUpdateNode = useCallback((nodeId, property, value) => {
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
  }, [setNodes]);

  const handleDeleteNode = useCallback((nodeId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este nodo?')) {
      setNodes((nds) => nds.filter(n => n.id !== nodeId));
      setEdges((eds) => eds.filter(e => e.source !== nodeId && e.target !== nodeId));
      setSelectedNodeId(null);
      setShowPropertiesPanel(false);
      setHasUnsavedChanges(true);
    }
  }, [setNodes, setEdges]);

  const handleDuplicateNode = useCallback((nodeId) => {
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
  }, [nodes, setNodes]);

  // Handlers de zoom y vista
  const handleZoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.1));
  }, []);

  const handleFitView = useCallback(() => {
    setZoomLevel(0.6);
  }, []);

  const handleCenterView = useCallback(() => {
    // Implementar centrado en el nodo seleccionado
  }, []);

  // Handlers de herramientas
  const handleDuplicateSelectedNode = useCallback(() => {
    if (selectedNodeId) {
      handleDuplicateNode(selectedNodeId);
    }
  }, [selectedNodeId, handleDuplicateNode]);

  const handleDeleteSelectedNode = useCallback(() => {
    if (selectedNodeId) {
      handleDeleteNode(selectedNodeId);
    }
  }, [selectedNodeId, handleDeleteNode]);

  const handleAutoLayout = useCallback(() => {
    setAutoLayout(!autoLayout);
  }, [autoLayout]);

  const handlePresentationMode = useCallback(() => {
    setPresentationMode(!presentationMode);
    if (!presentationMode) {
      setShowPropertiesPanel(false);
      setShowComponentsPanel(false);
      setShowRoadmapsPanel(false);
      setShowToolsPanel(false);
    }
  }, [presentationMode]);

  // Handlers de exportación/importación
  const handleExportData = useCallback(() => {
    const exportData = {
      roadmap: {
        title: roadmapInfo.title,
        description: roadmapInfo.description,
        type: roadmapType
      },
      nodes: nodes,
      edges: edges,
      metadata: {
        exportedAt: new Date().toISOString(),
        version: '1.0',
        totalNodes: nodes.length,
        totalConnections: edges.length
      }
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${roadmapType}-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [roadmapInfo, roadmapType, nodes, edges]);

  const handleImportData = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importData = JSON.parse(e.target.result);
          if (importData.nodes && importData.edges) {
            setNodes(importData.nodes);
            setEdges(importData.edges);
            setHasUnsavedChanges(true);
            alert('Datos importados correctamente');
          } else {
            alert('Formato de archivo inválido');
          }
        } catch (error) {
          console.error('Error importing data:', error);
          alert('Error al importar los datos');
        }
      };
      reader.readAsText(file);
    }
  }, [setNodes, setEdges]);

  const handleGenerateReport = useCallback(() => {
    const report = {
      roadmap: roadmapInfo.title,
      summary: {
        totalNodes: nodes.length,
        totalConnections: edges.length,
        nodeTypes: nodes.reduce((acc, node) => {
          const type = node.data.type || 'unknown';
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {})
      },
      nodes: nodes.map(node => ({
        id: node.id,
        label: node.data.label,
        type: node.data.type,
        description: node.data.description
      })),
      connections: edges.map(edge => ({
        source: edge.source,
        target: edge.target,
        type: edge.type
      }))
    };

    const reportStr = JSON.stringify(report, null, 2);
    const reportBlob = new Blob([reportStr], { type: 'application/json' });
    const url = URL.createObjectURL(reportBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${roadmapType}-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [roadmapInfo, roadmapType, nodes, edges]);

  // Pasar función de click a cada nodo
  const nodesWithClick = useMemo(() => 
    nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        onNodeClick: handleNodeClick,
        onDelete: (nodeId) => {
          if (window.confirm('¿Estás seguro de que quieres eliminar este nodo?')) {
            setNodes((nds) => nds.filter((n) => n.id !== nodeId));
            setEdges((eds) => eds.filter(e => e.source !== nodeId && e.target !== nodeId));
            setSelectedNodeId(null);
            setShowPropertiesPanel(false);
            setHasUnsavedChanges(true);
          }
        },
        onUpdateNode: (nodeId, property, value) => {
          setNodes((nds) =>
            nds.map((n) => {
              if (n.id === nodeId) {
                return {
                  ...n,
                  data: {
                    ...n.data,
                    [property]: value
                  }
                };
              }
              return n;
            })
          );
          setHasUnsavedChanges(true);
        },
        onUpdateResources: (type, value) => {
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
    })), [nodes, handleNodeClick, setNodes]
  );

  const onConnect = useCallback(
    (params) => {
      const newEdge = {
        ...params,
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: '#1e3a8a', strokeWidth: 3 }
      };
      setEdges((eds) => addEdge(newEdge, eds));
      setHasUnsavedChanges(true);
    },
    [setEdges]
  );



  return (
    <div className={`w-full h-screen bg-white flex flex-col ${presentationMode ? 'presentation-mode' : ''}`}>
      {/* Header */}
      <EditorHeader
        roadmapInfo={roadmapInfo}
        onShowToolsPanel={() => setShowToolsPanel(!showToolsPanel)}
        showToolsPanel={showToolsPanel}
        onPresentationMode={handlePresentationMode}
        presentationMode={presentationMode}
        onShowLiveView={() => setShowLiveView(!showLiveView)}
        onSave={handleCreateProposal}
        onEditModal={() => setShowEditModal(true)}
        onExit={() => navigate('/')}
      />

      {/* Sidebar */}
      <Sidebar
        showComponentsPanel={showComponentsPanel}
        showRoadmapsPanel={showRoadmapsPanel}
        onToggleComponentsPanel={() => {
          setShowComponentsPanel(!showComponentsPanel);
          setShowRoadmapsPanel(false);
          setShowToolsPanel(false);
        }}
        onToggleRoadmapsPanel={() => {
          setShowRoadmapsPanel(!showRoadmapsPanel);
          setShowComponentsPanel(false);
          setShowToolsPanel(false);
        }}
      />

      {/* Contenido Principal */}
      <div className="flex-1 relative">
        <div 
          className={`h-full ${presentationMode ? '' : 'ml-12'} ${showPropertiesPanel ? 'mr-80' : ''} ${showComponentsPanel || showRoadmapsPanel || showToolsPanel ? 'ml-80' : ''}`}
          onClick={() => {
            if (showPropertiesPanel) setShowPropertiesPanel(false);
            if (showComponentsPanel) setShowComponentsPanel(false);
            if (showRoadmapsPanel) setShowRoadmapsPanel(false);
            if (showToolsPanel) setShowToolsPanel(false);
          }}
        >
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
            onEdgeClick={handleEdgeClick}
            onConnect={onConnect}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView={false}
            fitViewOptions={{ padding: 0.2, includeHiddenNodes: false }}
            defaultViewport={{ x: 0, y: 0, zoom: zoomLevel }}
            minZoom={0.1}
            maxZoom={2}
            nodesDraggable={!presentationMode}
            nodesConnectable={!presentationMode}
            elementsSelectable={!presentationMode}
            panOnScroll={false}
            zoomOnScroll={false}
            panOnDrag={true}
            zoomOnPinch={true}
            panOnScrollMode="free"
            attributionPosition="bottom-left"
            preventScrolling={false}
            zoomOnDoubleClick={false}
            multiSelectionKeyCode={null}
            deleteKeyCode={presentationMode ? null : "Delete"}
            connectionMode="loose"
            snapToGrid={false}
            snapGrid={[15, 15]}
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
      </div>

      {/* Paneles */}
      <ComponentsPanel
        showComponentsPanel={showComponentsPanel}
        onClose={() => setShowComponentsPanel(false)}
        searchComponents={searchComponents}
        onSearchChange={(e) => setSearchComponents(e.target.value)}
        filteredComponents={filteredComponents}
        onAddComponent={handleAddComponent}
      />

      <ToolsPanel
        showToolsPanel={showToolsPanel}
        onClose={() => setShowToolsPanel(false)}
        selectedNodeId={selectedNodeId}
        onDuplicateSelectedNode={handleDuplicateSelectedNode}
        onDeleteSelectedNode={handleDeleteSelectedNode}
        showMiniMap={showMiniMap}
        onToggleMiniMap={() => setShowMiniMap(!showMiniMap)}
        onCenterView={handleCenterView}
        onAutoLayout={handleAutoLayout}
        onExportData={handleExportData}
        onImportData={handleImportData}
        onGenerateReport={handleGenerateReport}
        nodes={nodes}
        edges={edges}
        zoomLevel={zoomLevel}
      />

      <PropertiesPanel
        showPropertiesPanel={showPropertiesPanel}
        selectedNode={selectedNode}
        selectedEdge={selectedEdge}
        onClose={() => setShowPropertiesPanel(false)}
        onUpdateNode={handleUpdateNode}
        onUpdateEdge={handleUpdateEdge}
        propertiesTab={propertiesTab}
        onTabChange={setPropertiesTab}
      />

      {/* Panel de Roadmaps */}
      {showRoadmapsPanel && (
        <div className="fixed left-12 top-[4.5rem] w-80 h-[calc(100vh-5rem)] bg-white border-l border-gray-200 z-40 flex flex-col shadow-none">
          {/* Header minimalista */}
          <div className="flex items-center px-4 py-3 border-b border-gray-100">
            <span className="font-medium text-gray-700 text-base">Roadmaps</span>
          </div>
          {/* Buscador */}
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar roadmaps..."
                value={searchRoadmaps}
                onChange={(e) => setSearchRoadmaps(e.target.value)}
                className="w-full px-3 py-2 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          {/* Lista de roadmaps */}
          <div className="flex-1 overflow-y-auto p-4 bg-white">
            <div className="space-y-2">
              {filteredRoadmaps.length === 0 ? (
                <div className="text-center text-gray-400 py-8 text-sm">No se encontraron roadmaps</div>
              ) : (
                filteredRoadmaps.map((roadmap) => (
                  <div
                    key={roadmap.id}
                    className={`p-3 border rounded-lg transition-colors cursor-pointer ${
                      roadmap.isCurrent 
                        ? 'border-blue-200 bg-blue-50' 
                        : 'border-gray-100 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                    onClick={() => navigate(roadmap.path)}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{roadmap.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{roadmap.title}</h4>
                        <p className="text-xs text-gray-500">{roadmap.description}</p>
                      </div>
                      {roadmap.isCurrent ? (
                        <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">Actual</span>
                      ) : (
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

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

      {/* Modal de edición de título y descripción */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg mx-4">
            <h3 className="text-lg font-semibold mb-4">Editar Roadmap</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nuevo título..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Nueva descripción..."
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  // Aquí actualizarías el título y descripción en la base de datos
                  roadmapInfo.title = editTitle;
                  roadmapInfo.description = editDescription;
                  setShowEditModal(false);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Indicador de modo desarrollo discreto */}
      {isDevelopment && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full shadow-lg opacity-75 hover:opacity-100 transition-opacity">
            <span className="w-1.5 h-1.5 bg-white rounded-full inline-block mr-1"></span>
            DEV
          </div>
        </div>
      )}
    </div>
  );
};

export default EditRoadmapRefactored; 