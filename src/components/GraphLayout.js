import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
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

import CustomNode from './CustomNode';
import RecognitionPanel from './RecognitionPanel';
import { nodes as initialNodes } from '../data/nodes';
import { edges as initialEdges } from '../data/edges';
import { allRoadmapsData } from '../data/allRoadmaps';
import { roadmapStorageService } from '../lib/roadmapStorage';
import Auth from './Auth';
import { useUser } from '../UserContext';
import { useNavigate } from 'react-router-dom';
import EditWarningModal from './EditWarningModal';

function NodeDrawer({ node, onClose }) {
  if (!node) return null;

  // Función para obtener datos dinámicos del nodo
  const getNodeData = (node) => {
    // Obtener título del nodo (prioridad: título personalizado > label)
    const title = node.data.title || node.data.label || 'Sin título';
    
    // Obtener descripción del nodo
    const description = node.data.description || 'Sin descripción disponible.';
    
    // Obtener recursos gratuitos desde los links del nodo
    const freeResources = (node.data.links || []).map(link => ({
      type: link.type || 'artículo',
      title: link.title || 'Recurso sin título',
      url: link.url || '#'
    }));
    
    // Obtener recursos premium (por ahora vacío, se puede expandir después)
    const premiumResources = [];
    
    // Obtener icono del nodo
    const icon = node.data.icon || '📚';
    
    return {
      title,
      description,
      freeResources,
      premiumResources,
      icon
    };
  };

  const nodeData = getNodeData(node);

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-[200] transition-opacity duration-300"
        onClick={onClose}
      />
      {/* Drawer lateral - Responsive mejorado para móviles */}
      <div className="fixed top-0 right-0 h-screen w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 bg-white z-[210] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 md:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <span className="text-xl sm:text-2xl md:text-3xl">{nodeData.icon}</span>
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 truncate">{nodeData.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 sm:p-2"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto">
          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            {/* Texto explicativo */}
            <div>
              <p className="text-xs sm:text-sm md:text-base text-black leading-relaxed">
                {nodeData.description}
              </p>
            </div>

            {/* Recursos gratuitos - Solo mostrar si hay recursos configurados */}
            {nodeData.freeResources && nodeData.freeResources.length > 0 ? (
              <div>
                <div className="relative mb-3 sm:mb-4">
                  <div className="absolute top-1/2 left-0 right-0 border-t border-green-500"></div>
                  <div className="text-left pl-3 sm:pl-4">
                    <h4 className="text-xs sm:text-sm font-semibold text-green-700 border border-green-500 rounded-lg px-2 sm:px-3 py-1 bg-white inline-block relative z-10">
                      <svg className="inline w-3 h-3 mr-1 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                      Recursos gratuitos
                    </h4>
                  </div>
                </div>
                <div className="space-y-1">
                  {nodeData.freeResources.map((resource, index) => (
                    <div key={index} className="flex items-center">
                      <a
                        href={resource.url}
                        className={`text-xs sm:text-sm font-semibold px-2 py-1 rounded mr-2 sm:mr-3 transition-colors hover:opacity-80 ${
                          resource.type === 'artículo' ? 'bg-yellow-500 text-black' :
                          resource.type === 'video' ? 'bg-purple-500 text-black' :
                          resource.type === 'libro' ? 'bg-blue-500 text-black' :
                          'bg-gray-500 text-black'
                        }`}>
                        {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                      </a>
                      <a
                        href={resource.url}
                        className="text-gray-700 text-xs sm:text-sm md:text-base font-medium truncate hover:text-blue-600 transition-colors pr-2 sm:pr-4 underline decoration-gray-600 hover:decoration-blue-700"
                      >
                        {resource.title}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <h4 className="text-sm font-medium text-blue-900">Información del nodo</h4>
                    <p className="text-xs text-blue-700 mt-1">
                      Este nodo aún no tiene recursos configurados. Los recursos se pueden agregar desde el editor.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Recursos premium - Solo mostrar si hay recursos premium */}
            {nodeData.premiumResources && nodeData.premiumResources.length > 0 && (
              <div>
                <div className="relative mb-3 sm:mb-4">
                  <div className="absolute top-1/2 left-0 right-0 border-t border-purple-500"></div>
                  <div className="text-left pl-3 sm:pl-4">
                    <h4 className="text-xs sm:text-sm font-semibold text-purple-700 border border-purple-500 rounded-lg px-2 sm:px-3 py-1 bg-white inline-block relative z-10">
                      <svg className="inline w-3 h-3 mr-1 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      Recursos premium
                    </h4>
                  </div>
                </div>
                <div className="space-y-1">
                  {nodeData.premiumResources.map((resource, index) => (
                    <div key={index} className="flex items-center">
                      <a
                        href={resource.url}
                        className="text-xs sm:text-sm font-semibold px-2 py-1 rounded mr-2 sm:mr-3 transition-colors hover:opacity-80 bg-purple-500 text-black"
                      >
                        {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                      </a>
                      <a
                        href={resource.url}
                        className="text-gray-700 text-xs sm:text-sm md:text-base font-medium truncate hover:text-blue-600 transition-colors pr-2 sm:pr-4 underline decoration-gray-600 hover:decoration-blue-700"
                      >
                        {resource.title}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function FlowWithFitView() {
  const { fitView } = useReactFlow();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('FlowWithFitView: Ejecutando fit view automático');
      fitView({ 
        padding: 0.2, 
        includeHiddenNodes: false,
        duration: 800,
        minZoom: 0.1,
        maxZoom: 1.5
      });
    }, 1500); // Delay más largo para asegurar que todo esté renderizado

    return () => clearTimeout(timer);
  }, [fitView]);

  return null;
}

export default function GraphLayout({ roadmapType = 'termodinamica', customNodes, customEdges, readOnly = false, topVersion = null }) {
  // Obtener datos del roadmap específico
  const roadmapInfo = allRoadmapsData[roadmapType];
  
  // Intentar cargar datos guardados primero
  const savedRoadmap = roadmapStorageService.loadRoadmap(roadmapType);
  
  // Prioridad: customNodes/customEdges > savedRoadmap > roadmapInfo > initialNodes/initialEdges
  const initialRoadmapNodes = customNodes || (savedRoadmap ? savedRoadmap.nodes : (roadmapInfo ? roadmapInfo.nodes : initialNodes));
  const initialRoadmapEdges = customEdges || (savedRoadmap ? savedRoadmap.edges : (roadmapInfo ? roadmapInfo.edges : initialEdges));
  
  // Estado para los nodos y edges cargados desde la base de datos
  const [nodes, setNodes, onNodesChange] = useNodesState(initialRoadmapNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(
    initialRoadmapEdges.map(edge => ({
      ...edge,
      markerEnd: { type: MarkerType.ArrowClosed }
    }))
  );



  console.log('GraphLayout - customNodes:', customNodes);
  console.log('GraphLayout - customEdges:', customEdges);
  console.log('GraphLayout - initialRoadmapNodes:', initialRoadmapNodes);
  console.log('GraphLayout - initialRoadmapEdges:', initialRoadmapEdges);
  

  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();
  const [showEditWarning, setShowEditWarning] = useState(false);
  // Variable de ejemplo para mostrar el panel de versiones (ajusta según tu lógica real)
  const [showVersionPanel, setShowVersionPanel] = useState(false);

  // Crear nodeTypes dinámicamente para incluir readOnly
  const nodeTypes = useMemo(() => ({
    custom: (props) => <CustomNode {...props} readOnly={readOnly} onClick={() => props.data.onNodeClick(props.id)} />,
  }), [readOnly]);

  // Pasar función de click a cada nodo - solo para nodos con contenido
  const nodesWithClick = nodes.map(node => {
    const nodeType = node.data.nodeType || node.data.type;
    const shouldShowOffCanvas = ['topic', 'subtopic', 'todo'].includes(nodeType);
    
    return {
      ...node,
      data: {
        ...node.data,
        onNodeClick: shouldShowOffCanvas ? (id) => setSelectedNodeId(id) : undefined,
      },
    };
  });



  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  const handleEditClick = () => {
    // Detectar si la pantalla es pequeña
    if (window.innerWidth < 1024) {
      setShowEditWarning(true);
      return;
    }
    if (!user) {
      setShowAuth(true);
    } else {
      // Redirigir al entorno de edición y recargar la página
      navigate(`/edit/${roadmapType}`);
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Área de React Flow */}
      <div className="react-flow-container">
        <ReactFlow
          nodes={nodesWithClick}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView={false}
          fitViewOptions={{ padding: 0.2, includeHiddenNodes: false }}
          defaultViewport={{ x: 0, y: 0, zoom: 0.2 }}
          minZoom={0.05}
          maxZoom={2}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={true}
          panOnScroll={false}
          zoomOnScroll={false}
          panOnDrag={true}
          zoomOnPinch={true}
          panOnScrollMode="free"
          attributionPosition="bottom-left"
          translateExtent={[[-10000, -10000], [10000, 10000]]}
          onlyRenderVisibleElements={false}
        >
          <Controls />
          <Background 
            variant="dots" 
            gap={20} 
            size={1} 
            color="#ffffff"
            style={{ backgroundColor: 'transparent' }}
          />
          <FlowWithFitView />
        </ReactFlow>
      </div>
      {/* Drawer lateral fullscreen */}
      <NodeDrawer node={selectedNode} onClose={() => setSelectedNodeId(null)} />
      {/* Modal de autenticación */}
      {showAuth && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button 
              onClick={() => setShowAuth(false)} 
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-3xl font-bold leading-none focus:outline-none"
              style={{lineHeight: '1', width: '2.5rem', height: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              &times;
            </button>
            <Auth onClose={() => setShowAuth(false)} />
          </div>
        </div>
      )}
      {showEditWarning && <EditWarningModal onClose={() => setShowEditWarning(false)} />}
    </div>
  );
} 