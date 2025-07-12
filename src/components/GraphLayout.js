import React, { useState, useCallback, useEffect, useRef } from 'react';
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
import useLayout from '../hooks/useLayout';
import { nodes as initialNodes } from '../data/nodes';
import { edges as initialEdges } from '../data/edges';
import Auth from './Auth';
import { useUser } from '../UserContext';
import { useNavigate } from 'react-router-dom';

const nodeTypes = {
  custom: (props) => <CustomNode {...props} onClick={() => props.data.onNodeClick(props.id)} />,
};

function NodeDrawer({ node, onClose }) {
  if (!node) return null;

  // Datos de ejemplo para termodinámica (puedes personalizar según cada nodo)
  const getNodeData = (nodeId) => {
    const nodeData = {
      'termodinamica-basica': {
        title: 'Termodinámica Básica',
        description: 'La termodinámica es la rama de la física que estudia las relaciones entre el calor, la energía y el trabajo. En ingeniería metalúrgica, es fundamental para entender los procesos de transformación de materiales, las reacciones químicas y los cambios de fase que ocurren durante la extracción y refinación de metales. Esta disciplina proporciona las herramientas matemáticas y conceptuales necesarias para analizar y optimizar los procesos industriales.',
        freeResources: [
          { type: 'artículo', title: 'Introducción a la Termodinámica', url: '#' },
          { type: 'video', title: 'Primera Ley de la Termodinámica', url: '#' },
          { type: 'artículo', title: 'Segunda Ley de la Termodinámica', url: '#' },
          { type: 'video', title: 'Termodinámica en 5 minutos', url: '#' },
          { type: 'libro', title: 'Fundamentos de Termodinámica Metalúrgica', url: '#' }
        ],
        premiumResources: [
          { type: 'curso', title: 'Termodinámica Avanzada para Metalurgia', discount: '20%', url: '#' },
          { type: 'curso', title: 'Aplicaciones Termodinámicas en Procesos Metalúrgicos', discount: '15%', url: '#' }
        ]
      },
      'entalpia': {
        title: 'Entalpía',
        description: 'La entalpía es una propiedad termodinámica que representa la cantidad total de energía contenida en un sistema. En metalurgia, es crucial para calcular el calor necesario en procesos como la fundición, el refinamiento y las reacciones químicas que ocurren durante la extracción de metales. Esta propiedad permite determinar la energía requerida para transformar los materiales y optimizar los procesos industriales de manera eficiente.',
        freeResources: [
          { type: 'artículo', title: '¿Qué es la Entalpía?', url: '#' },
          { type: 'video', title: 'Cálculo de Entalpía en Reacciones Químicas', url: '#' },
          { type: 'artículo', title: 'Entalpía en Procesos Metalúrgicos', url: '#' },
          { type: 'libro', title: 'Entalpía y Transformaciones de Fase', url: '#' }
        ],
        premiumResources: [
          { type: 'curso', title: 'Entalpía y Procesos Metalúrgicos', discount: '25%', url: '#' }
        ]
      },
      'entropia': {
        title: 'Entropía',
        description: 'La entropía es una medida del desorden o aleatoriedad en un sistema. En metalurgia, ayuda a entender la espontaneidad de las reacciones químicas y la dirección de los procesos de transformación de materiales. Esta propiedad termodinámica es fundamental para predecir si una reacción ocurrirá espontáneamente y determinar las condiciones óptimas para los procesos industriales.',
        freeResources: [
          { type: 'artículo', title: 'Concepto de Entropía', url: '#' },
          { type: 'video', title: 'Entropía en Reacciones Químicas', url: '#' },
          { type: 'artículo', title: 'Entropía y Espontaneidad', url: '#' },
          { type: 'libro', title: 'Entropía en Sistemas Metalúrgicos', url: '#' }
        ],
        premiumResources: [
          { type: 'curso', title: 'Entropía en Ingeniería Metalúrgica', discount: '20%', url: '#' }
        ]
      }
    };

    return nodeData[nodeId] || {
      title: node.data.label,
      description: 'La termodinámica es fundamental en ingeniería metalúrgica para entender los procesos de transformación de materiales. Esta disciplina estudia las relaciones entre calor, energía y trabajo, proporcionando las herramientas necesarias para analizar y optimizar procesos industriales complejos.',
      freeResources: [
        { type: 'artículo', title: 'Recurso gratuito 1', url: '#' },
        { type: 'video', title: 'Video explicativo', url: '#' },
        { type: 'libro', title: 'Libro de referencia', url: '#' }
      ],
      premiumResources: [
        { type: 'curso', title: 'Curso premium', discount: '20%', url: '#' }
      ]
    };
  };

  const nodeData = getNodeData(node.id);

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
            <span className="text-xl sm:text-2xl md:text-3xl">{node.data.icon}</span>
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

            {/* Recursos gratuitos */}
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

            {/* Recursos premium */}
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
              <div className="text-center py-3 sm:py-4">
                <p className="text-gray-500 text-xs sm:text-sm font-medium">Muy pronto</p>
              </div>
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

const GraphLayout = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    initialEdges.map(edge => ({
      ...edge,
      markerEnd: { type: MarkerType.ArrowClosed }
    }))
  );
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

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

  const handleEditClick = () => {
    if (!user) {
      setShowAuth(true);
    } else {
      // Redirigir al entorno de edición
      navigate('/edit/termodinamica');
    }
  };

  return (
    <div className="w-full h-full relative">
      {/* Botón de edición */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={handleEditClick}
          className="px-4 py-2 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 bg-blue-500 hover:bg-blue-600 text-white"
        >
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="text-sm font-medium">Editar</span>
          </div>
        </button>
      </div>

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
          nodesDraggable={false}
          nodesConnectable={false}
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
          deleteKeyCode={null}
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
      {/* Drawer lateral fullscreen */}
      <NodeDrawer node={selectedNode} onClose={() => setSelectedNodeId(null)} />
      
      {/* Modal de autenticación */}
      {showAuth && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button 
              onClick={() => setShowAuth(false)} 
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-3xl font-bold leading-none focus:outline-none"
              style={{lineHeight: '1', width: '2.5rem', height: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
            >
              &times;
            </button>
            <Auth onClose={() => setShowAuth(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphLayout; 