import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ReactFlow, useNodesState, useEdgesState, addEdge, MarkerType, Controls, Background, useReactFlow } from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './CustomNode';
import { allRoadmapsData } from '../data/allRoadmaps';
import { nodes as initialNodes } from '../data/nodes';
import { edges as initialEdges } from '../data/edges';
import { roadmapStorageService } from '../lib/roadmapStorage';
import { useUser } from '../UserContext';
import { useNavigate } from 'react-router-dom';
import Auth from './Auth';
import EditWarningModal from './EditWarningModal';
import TopVersionsSection from './TopVersionsSection';
import RecognitionPanel from './RecognitionPanel';

function NodeDrawer({ node, onClose }) {
  const [activeTab, setActiveTab] = useState('resources'); // Solo Resources por ahora

  if (!node) return null;

  const getNodeData = (node) => {
    const nodeType = node.data.nodeType || node.data.type;
    const label = node.data.label || '';
    
    return {
      title: label,
      content: node.data.content || '',
      links: node.data.links || [],
      videos: node.data.videos || [],
      articles: node.data.articles || [],
      openSource: node.data.openSource || []
    };
  };

  const nodeData = getNodeData(node);

  return (
    <>
      {/* Overlay gris transparente */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={onClose}></div>
      
      {/* Off-canvas */}
      <div className="fixed top-0 right-0 z-40 flex h-screen w-full flex-col overflow-y-auto bg-white p-4 focus:outline-0 sm:max-w-[600px] sm:p-6">
      <div className="flex-1">
        <div className="flex justify-between">
          <div className="flex w-max gap-1.5">
            <button 
              className={`flex select-none disabled:pointer-events-none items-center gap-2 rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-500 hover:border-gray-400 data-[state=active]:border-black data-[state=active]:bg-black data-[state=active]:text-white ${activeTab === 'resources' ? 'data-[state=active]:border-black data-[state=active]:bg-black data-[state=active]:text-white' : ''}`}
              data-state={activeTab === 'resources' ? 'active' : 'inactive'}
              type="button"
              onClick={() => setActiveTab('resources')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-earth h-4 w-4" aria-hidden="true">
                <path d="M21.54 15H17a2 2 0 0 0-2 2v4.54"></path>
                <path d="M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17"></path>
                <path d="M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05"></path>
                <circle cx="12" cy="12" r="10"></circle>
              </svg>
              <span className="hidden sm:block">Resources</span>
            </button>

          </div>
          <div className="flex flex-grow justify-end gap-1">
            <button 
              type="button" 
              id="close-topic" 
              className="flex items-center gap-1.5 rounded-lg bg-gray-200 px-1.5 py-1 text-xs text-black hover:bg-gray-300 hover:text-gray-900"
              onClick={onClose}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x size-4" aria-hidden="true">
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <div className="prose prose-quoteless prose-h1:mb-2.5 prose-h1:mt-7 prose-h1:text-balance prose-h2:mb-3 prose-h2:mt-0 prose-h3:mb-[5px] prose-h3:mt-[10px] prose-p:mb-2 prose-p:mt-0 prose-blockquote:font-normal prose-blockquote:not-italic prose-blockquote:text-gray-700 prose-li:m-0 prose-li:mb-0.5">
          <div id="topic-content">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{nodeData.title}</h1>
            {nodeData.content && <p>{nodeData.content}</p>}
            
            {activeTab === 'resources' && (
              <>
                {(nodeData.links.length > 0 || nodeData.videos.length > 0 || nodeData.articles.length > 0 || nodeData.openSource.length > 0) && (
                  <p>Visit the following resources to learn more:</p>
                )}
                
                {nodeData.links.length > 0 && (
                  <>
                    <p className="relative mt-6 flex items-center justify-start text-green-600">
                      <span className="relative left-3 z-50 inline-flex items-center gap-1 rounded-md border border-current bg-white px-2 py-0.5 text-xs font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart-handshake inline-block h-3 w-3 fill-current" aria-hidden="true">
                          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                          <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66"></path>
                          <path d="m18 15-2-2"></path>
                          <path d="m15 18-2-2"></path>
                        </svg>
                        Free Resources
                      </span>
                      <span className="absolute inset-x-0 h-px w-full grow bg-current"></span>
                    </p>
                    <ul className="mt-4 ml-3 space-y-1">
                      {nodeData.links.map((link, index) => (
                        <li key={index}>
                          <a href={link.url} target="_blank" className="group font-medium text-gray-800 underline underline-offset-1 hover:text-black">
                            <span className="mr-2">
                              <span className="inline-block rounded-sm px-1.5 py-0.5 text-xs capitalize no-underline bg-yellow-300">link</span>
                            </span>
                            {link.title || link.url}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                
                {nodeData.videos.length > 0 && (
                  <>
                    <p className="relative mt-6 flex items-center justify-start text-purple-600">
                      <span className="relative left-3 z-50 inline-flex items-center gap-1 rounded-md border border-current bg-white px-2 py-0.5 text-xs font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play inline-block h-3 w-3 fill-current" aria-hidden="true">
                          <polygon points="5,3 19,12 5,21"></polygon>
                        </svg>
                        Videos
                      </span>
                      <span className="absolute inset-x-0 h-px w-full grow bg-current"></span>
                    </p>
                    <ul className="mt-4 ml-3 space-y-1">
                      {nodeData.videos.map((video, index) => (
                        <li key={index}>
                          <a href={video.url} target="_blank" className="group font-medium text-gray-800 underline underline-offset-1 hover:text-black">
                            <span className="mr-2">
                              <span className="inline-block rounded-sm px-1.5 py-0.5 text-xs capitalize no-underline bg-purple-300">video</span>
                            </span>
                            {video.title || video.url}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                
                {nodeData.articles.length > 0 && (
                  <>
                    <p className="relative mt-6 flex items-center justify-start text-blue-600">
                      <span className="relative left-3 z-50 inline-flex items-center gap-1 rounded-md border border-current bg-white px-2 py-0.5 text-xs font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text inline-block h-3 w-3 fill-current" aria-hidden="true">
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                          <polyline points="14,2 14,8 20,8"></polyline>
                          <line x1="16" x2="8" y1="13" y2="13"></line>
                          <line x1="16" x2="8" y1="17" y2="17"></line>
                          <polyline points="10,9 9,9 8,9"></polyline>
                        </svg>
                        Articles
                      </span>
                      <span className="absolute inset-x-0 h-px w-full grow bg-current"></span>
                    </p>
                    <ul className="mt-4 ml-3 space-y-1">
                      {nodeData.articles.map((article, index) => (
                        <li key={index}>
                          <a href={article.url} target="_blank" className="group font-medium text-gray-800 underline underline-offset-1 hover:text-black">
                            <span className="mr-2">
                              <span className="inline-block rounded-sm px-1.5 py-0.5 text-xs capitalize no-underline bg-yellow-300">article</span>
                            </span>
                            {article.title || article.url}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                
                {nodeData.openSource.length > 0 && (
                  <>
                    <p className="relative mt-6 flex items-center justify-start text-green-600">
                      <span className="relative left-3 z-50 inline-flex items-center gap-1 rounded-md border border-current bg-white px-2 py-0.5 text-xs font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github inline-block h-3 w-3 fill-current" aria-hidden="true">
                          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2s-.28 1.15 0 3.5c-.73 1.02-1.08 2.25-1 3.5 0 3.5 3 5.5 6 5.5-.19.98-.3 2-.16 3.04A6.6 6.6 0 0 0 9 22c0 .55.45 1 1 1h4c.55 0 1-.45 1-1Z"></path>
                        </svg>
                        Open Source
                      </span>
                      <span className="absolute inset-x-0 h-px w-full grow bg-current"></span>
                    </p>
                    <ul className="mt-4 ml-3 space-y-1">
                      {nodeData.openSource.map((repo, index) => (
                        <li key={index}>
                          <a href={repo.url} target="_blank" className="group font-medium text-gray-800 underline underline-offset-1 hover:text-black">
                            <span className="mr-2">
                              <span className="inline-block rounded-sm px-1.5 py-0.5 text-xs capitalize no-underline bg-green-300">repo</span>
                            </span>
                            {repo.title || repo.url}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </>
            )}
            

          </div>
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

  // Actualizar nodos y edges cuando cambien customNodes/customEdges
  useEffect(() => {
    if (customNodes && customEdges) {
      console.log('GraphLayout: Actualizando con customNodes/customEdges');
      setNodes(customNodes);
      setEdges(customEdges.map(edge => ({
        ...edge,
        markerEnd: { type: MarkerType.ArrowClosed }
      })));
    } else {
      console.log('GraphLayout: Usando datos por defecto');
      setNodes(initialRoadmapNodes);
      setEdges(initialRoadmapEdges.map(edge => ({
        ...edge,
        markerEnd: { type: MarkerType.ArrowClosed }
      })));
    }
  }, [customNodes, customEdges, initialRoadmapNodes, initialRoadmapEdges, setNodes, setEdges]);

  console.log('GraphLayout - customNodes:', customNodes);
  console.log('GraphLayout - customEdges:', customEdges);
  console.log('GraphLayout - initialRoadmapNodes:', initialRoadmapNodes);
  console.log('GraphLayout - initialRoadmapEdges:', initialRoadmapEdges);
  console.log('GraphLayout - current nodes state:', nodes);
  console.log('GraphLayout - current edges state:', edges);

  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();
  const [showEditWarning, setShowEditWarning] = useState(false);
  // Variable de ejemplo para mostrar el panel de versiones (ajusta según tu lógica real)
  const [showVersionPanel, setShowVersionPanel] = useState(false);

  // Crear nodeTypes dinámicamente para incluir readOnly
  const nodeTypes = useMemo(() => ({
    custom: (props) => (
      <CustomNode 
        {...props} 
        readOnly={readOnly} 
        onNodeSelect={setSelectedNodeId}
      />
    ),
  }), [readOnly]);

  // Pasar información del nodo para mostrar off-canvas
  const nodesWithClick = useMemo(() => {
    return nodes.map(node => {
      const nodeType = node.data.nodeType || node.data.type;
      const shouldShowOffCanvas = ['topic', 'subtopic', 'todo'].includes(nodeType);
      
      return {
        ...node,
        data: {
          ...node.data,
          shouldShowOffCanvas,
          nodeId: node.id,
        },
      };
    });
  }, [nodes]);

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

      {/* Off-canvas para información del nodo en modo de lectura */}
      {selectedNodeId && selectedNode && (
        <NodeDrawer
          node={selectedNode}
          onClose={() => setSelectedNodeId(null)}
        />
      )}

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