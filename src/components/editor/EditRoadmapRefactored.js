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
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useUser } from '../../UserContext';
import { roadmapStorage } from '../../lib/roadmapStorage';
import { proposalService } from '../../lib/roadmapStorage';
import { roadmapStorageService } from '../../lib/roadmapStorage';
import { supabase } from '../../lib/supabase';
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
  const [searchParams] = useSearchParams();
  const versionId = searchParams.get('version');
  const mode = searchParams.get('mode');
  
  // Obtener datos del roadmap
  const roadmapInfo = useMemo(() => roadmapData[roadmapType], [roadmapType]);
  
  // Crear título personalizado si estamos editando una versión específica
  const editorTitle = useMemo(() => {
    if (mode === 'proposal') {
      return `${roadmapInfo.title} (Modo Propuesta)`;
    }
    if (versionId) {
      return `${roadmapInfo.title} (Editando Versión)`;
    }
    return roadmapInfo.title;
  }, [roadmapInfo.title, versionId, mode]);

  // Determinar si estamos en modo solo propuesta (solo si mode=proposal)
  const isProposalOnlyMode = useMemo(() => {
    return mode === 'proposal';
  }, [mode]);
  
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
  const [nodes, setNodes, onNodesChange] = useNodesState(roadmapInfo.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    (roadmapInfo.edges || []).map(edge => ({
      ...edge,
      type: 'straight', // Tipo por defecto
      markerEnd: { 
        type: MarkerType.ArrowClosed,
        color: '#1e3a8a' // Color inicial de la flecha
      },
      style: { stroke: '#1e3a8a', strokeWidth: 3 }
    }))
  );

  // Mostrar error si no hay nodos cargados
  if (!nodes || nodes.length === 0) {
    return (
      <div className="w-full h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-700 mb-4">No se pudieron cargar los nodos del roadmap</h1>
          <p className="text-gray-600 mb-6">Verifica tu conexión o la configuración de la base de datos.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Cargar datos de versión específica si está disponible
  useEffect(() => {
    if (versionId) {
      const storageKey = `roadmap_${roadmapType}_version_${versionId}`;
      const versionData = localStorage.getItem(storageKey);
      
      if (versionData) {
        try {
          const parsedData = JSON.parse(versionData);
          if (parsedData.nodes && parsedData.edges) {
            console.log('Cargando datos de versión específica:', versionId);
            setNodes(parsedData.nodes);
            setEdges(parsedData.edges.map(edge => ({
              ...edge,
              type: edge.type || 'straight',
              markerEnd: edge.markerEnd || { 
                type: MarkerType.ArrowClosed,
                color: '#1e3a8a'
              },
              style: edge.style || { stroke: '#1e3a8a', strokeWidth: 3 }
            })));
            
            // Limpiar los datos del localStorage después de cargarlos
            localStorage.removeItem(storageKey);
            
            // Activar automáticamente el modo propuesta cuando se carga una versión específica
            setProposalMode(false); // No activar modo propuesta automáticamente
          }
        } catch (error) {
          console.error('Error cargando datos de versión:', error);
        }
      }
    }
  }, [versionId, roadmapType, setNodes, setEdges]);

  // Activar modo propuesta automáticamente solo si mode=proposal
  useEffect(() => {
    setProposalMode(mode === 'proposal');
  }, [mode]);
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
  const [proposalMode, setProposalMode] = useState(false);
  const [userExistingProposal, setUserExistingProposal] = useState(null);

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

  // Cargar propuestas existentes y propuesta del usuario
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

    const loadUserProposal = async () => {
      if (!user) return;
      
      try {
        const { data: userProposal, error } = await supabase
          .from('edit_proposals')
          .select('*')
          .eq('roadmap_type', roadmapType)
          .eq('user_id', user.id)
          .eq('status', 'pending')
          .single();

        if (!error && userProposal) {
          setUserExistingProposal(userProposal);
        }
      } catch (error) {
        // Si no hay propuesta existente, continuar
        console.log('No hay propuesta pendiente del usuario');
      }
    };

    loadProposals();
    loadUserProposal();
  }, [roadmapType, isDevelopment, user]);

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

  // Cerrar panel de propiedades al hacer clic fuera
  const handleClickOutside = useCallback((event) => {
    const propertiesPanel = document.querySelector('.properties-panel');
    const overlay = document.querySelector('.properties-overlay');
    
    // Si el clic fue en el overlay (fuera del panel), cerrar el panel
    if (event.target === overlay) {
      setShowPropertiesPanel(false);
      setSelectedNodeId(null);
      setSelectedEdgeId(null);
    }
  }, []);

  // Agregar event listener para cerrar panel con Escape
  useEffect(() => {
    if (showPropertiesPanel) {
      const handleEscape = (event) => {
        if (event.key === 'Escape') {
          setShowPropertiesPanel(false);
          setSelectedNodeId(null);
          setSelectedEdgeId(null);
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [showPropertiesPanel]);

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

  const handleCreateProposalFromEditor = useCallback(async () => {
    if (!user) {
      alert('Debes iniciar sesión para crear una propuesta');
      return;
    }

    // Verificar si el usuario ya tiene una propuesta pendiente
    try {
      const { data: existingProposal, error } = await supabase
        .from('edit_proposals')
        .select('*')
        .eq('roadmap_type', roadmapType)
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .single();

      if (existingProposal && !userExistingProposal) {
        alert('Ya tienes una propuesta pendiente. No puedes crear otra propuesta hasta que la actual sea aprobada o rechazada.');
        return;
      }
    } catch (error) {
      // Si no hay propuesta existente, continuar
      console.log('No hay propuesta pendiente del usuario');
    }

    // Comparar con la versión original para detectar cambios
    const originalNodes = roadmapInfo.nodes;
    const originalEdges = roadmapInfo.edges;
    
    const changes = [];
    
    // Detectar nodos agregados
    const addedNodes = nodes.filter(node => 
      !originalNodes.find(originalNode => originalNode.id === node.id)
    );
    
    // Detectar nodos modificados
    const modifiedNodes = nodes.filter(node => {
      const originalNode = originalNodes.find(originalNode => originalNode.id === node.id);
      return originalNode && JSON.stringify(originalNode) !== JSON.stringify(node);
    });
    
    // Detectar nodos eliminados
    const deletedNodes = originalNodes.filter(originalNode => 
      !nodes.find(node => node.id === originalNode.id)
    );
    
    // Detectar conexiones agregadas
    const addedEdges = edges.filter(edge => 
      !originalEdges.find(originalEdge => originalEdge.id === edge.id)
    );
    
    // Detectar conexiones modificadas
    const modifiedEdges = edges.filter(edge => {
      const originalEdge = originalEdges.find(originalEdge => originalEdge.id === edge.id);
      return originalEdge && JSON.stringify(originalEdge) !== JSON.stringify(edge);
    });
    
    // Detectar conexiones eliminadas
    const deletedEdges = originalEdges.filter(originalEdge => 
      !edges.find(edge => edge.id === originalEdge.id)
    );
    
    // Crear cambios para la propuesta
    addedNodes.forEach(node => {
      changes.push({
        type: 'node',
        action: 'add',
        before: null,
        after: node.data.label
      });
    });
    
    modifiedNodes.forEach(node => {
      const originalNode = originalNodes.find(originalNode => originalNode.id === node.id);
      changes.push({
        type: 'node',
        action: 'modify',
        before: originalNode.data.label,
        after: node.data.label
      });
    });
    
    deletedNodes.forEach(node => {
      changes.push({
        type: 'node',
        action: 'remove',
        before: node.data.label,
        after: null
      });
    });
    
    addedEdges.forEach(edge => {
      const sourceNode = nodes.find(node => node.id === edge.source);
      const targetNode = nodes.find(node => node.id === edge.target);
      changes.push({
        type: 'connection',
        action: 'add',
        before: null,
        after: `${sourceNode?.data.label || 'Nodo'} → ${targetNode?.data.label || 'Nodo'}`
      });
    });
    
    modifiedEdges.forEach(edge => {
      const originalEdge = originalEdges.find(originalEdge => originalEdge.id === edge.id);
      const sourceNode = nodes.find(node => node.id === edge.source);
      const targetNode = nodes.find(node => node.id === edge.target);
      const originalSourceNode = originalNodes.find(node => node.id === originalEdge.source);
      const originalTargetNode = originalNodes.find(node => node.id === originalEdge.target);
      
      changes.push({
        type: 'connection',
        action: 'modify',
        before: `${originalSourceNode?.data.label || 'Nodo'} → ${originalTargetNode?.data.label || 'Nodo'}`,
        after: `${sourceNode?.data.label || 'Nodo'} → ${targetNode?.data.label || 'Nodo'}`
      });
    });
    
    deletedEdges.forEach(edge => {
      const sourceNode = originalNodes.find(node => node.id === edge.source);
      const targetNode = originalNodes.find(node => node.id === edge.target);
      changes.push({
        type: 'connection',
        action: 'remove',
        before: `${sourceNode?.data.label || 'Nodo'} → ${targetNode?.data.label || 'Nodo'}`,
        after: null
      });
    });
    
    if (changes.length === 0) {
      alert('No hay cambios para proponer. Realiza algunas modificaciones primero.');
      return;
    }
    
    // Crear la propuesta
    const proposal = {
      title: `Propuesta de edición para ${roadmapInfo.title}`,
      description: proposalDescription || 'Cambios propuestos por el usuario',
      changes: changes,
      author: { name: user.email || 'Usuario' },
      created_at: new Date().toISOString(),
      status: 'pending',
      votes: [],
      comments: []
    };
    
    try {
      // En modo desarrollo, simular guardado
      if (isDevelopment) {
        console.log('Propuesta creada:', proposal);
        alert('Propuesta creada exitosamente (modo desarrollo)');
        setProposalMode(false);
        setProposalDescription('');
        return;
      }
      
      // En producción, actualizar o crear propuesta
      let result;
      if (userExistingProposal) {
        // Actualizar propuesta existente
        const { data, error } = await supabase
          .from('edit_proposals')
          .update({
            title: proposal.title,
            description: proposal.description,
            changes: proposal.changes,
            updated_at: new Date().toISOString()
          })
          .eq('id', userExistingProposal.id)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
        alert('Propuesta actualizada exitosamente');
      } else {
        // Crear nueva propuesta
        const { data, error } = await supabase
          .from('edit_proposals')
          .insert({
            roadmap_type: roadmapType,
            user_id: user.id,
            title: proposal.title,
            description: proposal.description,
            changes: proposal.changes,
            status: 'pending'
          })
          .select()
          .single();
        
        if (error) throw error;
        result = data;
        alert('Propuesta creada exitosamente');
      }
      
      setProposalMode(false);
      setProposalDescription('');
      
    } catch (error) {
      console.error('Error creating/updating proposal:', error);
      alert('Error al procesar la propuesta: ' + error.message);
    }
  }, [user, nodes, edges, roadmapInfo, roadmapType, proposalDescription, isDevelopment]);

  const handleCreateProposal = useCallback(async () => {
    // Si estamos en modo solo propuesta, no permitir guardar como versión
    if (isProposalOnlyMode) {
      alert('No puedes guardar como nueva versión cuando estás editando una versión específica. Usa el botón "Crear Propuesta" para proponer cambios.');
      return;
    }

    // En modo desarrollo, simular el guardado exitoso
    if (isDevelopment) {
      console.log('Modo desarrollo: simulando guardado exitoso');
      setSaveStatus('saving');
      
      // Simular tiempo de guardado
      setTimeout(() => {
        // Guardar en localStorage
        const saveSuccess = roadmapStorageService.saveRoadmap(roadmapType, nodes, edges);
        
        // Actualizar los datos del roadmap en memoria
        if (roadmapData[roadmapType]) {
          roadmapData[roadmapType].nodes = [...nodes];
          roadmapData[roadmapType].edges = [...edges];
          console.log('Roadmap actualizado:', roadmapType, roadmapData[roadmapType]);
        }
        
        setSaveStatus('saved');
        setHasUnsavedChanges(false);
        
        // Mostrar notificación de éxito
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full';
        notification.innerHTML = `
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span class="font-medium">¡Roadmap guardado exitosamente!</span>
          </div>
        `;
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
          notification.classList.remove('translate-x-full');
        }, 100);
        
        // Remover después de 3 segundos
        setTimeout(() => {
          notification.classList.add('translate-x-full');
          setTimeout(() => {
            document.body.removeChild(notification);
          }, 300);
        }, 3000);
        
        setSaveStatus('idle');
      }, 1000);
      return;
    }

    // En producción, verificar autenticación
    if (!user) {
      alert('Debes iniciar sesión para guardar cambios');
      return;
    }

    setSaveStatus('saving');

    try {
      // Verificar si estamos en desarrollo o si hay error de conexión
      if (isDevelopment) {
        // En desarrollo, simular guardado exitoso
        console.log('Modo desarrollo: simulando guardado en BD');
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        // Guardar versión en la base de datos
        console.log('Guardando versión en BD para roadmap:', roadmapType);
        console.log('Datos a guardar:', { roadmapType, userId: user.id, nodesCount: nodes.length, edgesCount: edges.length });
        
        const { data: version, error } = await supabase
          .from('roadmap_versions')
          .insert({
            roadmap_type: roadmapType,
            user_id: user.id,
            nodes: nodes,
            edges: edges,
            description: `Versión editada por ${user.email}`,
            is_public: true,
            total_votes: 0,
            up_votes: 0,
            down_votes: 0
          })
          .select()
          .single();

        if (error) {
          console.error('Error al guardar en BD:', error);
          throw error;
        }
        
        console.log('Versión guardada exitosamente:', version);
      }
      
      setSaveStatus('saved');
      setHasUnsavedChanges(false);
      
      // Mostrar notificación de éxito
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full';
      notification.innerHTML = `
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span class="font-medium">¡Versión pública guardada exitosamente!</span>
        </div>
      `;
      document.body.appendChild(notification);
      
      // Animar entrada
      setTimeout(() => {
        notification.classList.remove('translate-x-full');
      }, 100);
      
      // Remover después de 3 segundos
      setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 3000);
      
      setSaveStatus('idle');
    } catch (error) {
      console.error('Error saving changes:', error);
      setSaveStatus('error');
      
      // Mostrar notificación de error
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full';
      notification.innerHTML = `
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          <span class="font-medium">Error al guardar: ${error.message}</span>
        </div>
      `;
      document.body.appendChild(notification);
      
      // Animar entrada
      setTimeout(() => {
        notification.classList.remove('translate-x-full');
      }, 100);
      
      // Remover después de 5 segundos
      setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 5000);
    }
  }, [isDevelopment, user, nodes, edges, roadmapInfo, roadmapType]);

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
    <div className="w-screen h-screen flex flex-col m-0 p-0 overflow-hidden" style={{ position: 'relative' }}>
      {/* Header - Primero */}
      <EditorHeader
        roadmapInfo={{ ...roadmapInfo, title: editorTitle }}
        onShowToolsPanel={() => setShowToolsPanel(!showToolsPanel)}
        showToolsPanel={showToolsPanel}
        onPresentationMode={handlePresentationMode}
        presentationMode={presentationMode}
        onShowLiveView={() => setShowLiveView(!showLiveView)}
        onSave={handleCreateProposal}
        onEditModal={() => setShowEditModal(true)}
        onExit={() => navigate('/')}
        saveStatus={saveStatus}
        hasUnsavedChanges={hasUnsavedChanges}
        proposalMode={proposalMode}
        onToggleProposalMode={() => setProposalMode(!proposalMode)}
        onCreateProposal={handleCreateProposalFromEditor}
        isProposalOnlyMode={isProposalOnlyMode}
      />

      {/* Banner de modo propuesta */}
      {(proposalMode || isProposalOnlyMode) && (
        <div className="bg-orange-50 border-b border-orange-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-orange-800">
                  {isProposalOnlyMode 
                    ? 'Editando Versión - Modo Propuesta Automático'
                    : userExistingProposal 
                      ? 'Editando Propuesta Existente' 
                      : 'Modo Propuesta de Edición'
                  }
                </h3>
                <p className="text-xs text-orange-600">
                  {isProposalOnlyMode
                    ? 'Estás editando una versión específica. El modo propuesta se activó automáticamente. Solo puedes crear propuestas.'
                    : userExistingProposal 
                      ? 'Estás editando tu propuesta pendiente. Los cambios se actualizarán automáticamente.'
                      : versionId 
                        ? 'Los cambios que hagas se guardarán como una propuesta basada en esta versión'
                        : 'Los cambios que hagas se guardarán como una propuesta para la comunidad'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <textarea
                value={proposalDescription}
                onChange={(e) => setProposalDescription(e.target.value)}
                placeholder="Describe tu propuesta (opcional)..."
                className="px-3 py-1 text-xs border border-orange-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-transparent resize-none"
                rows={1}
                style={{ width: '200px' }}
              />
              {!isProposalOnlyMode && (
                <button
                  onClick={() => setProposalMode(false)}
                  className="text-orange-600 hover:text-orange-800 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Área principal con barra lateral y React Flow */}
      <div className="flex-1 flex flex-row bg-gray-50 m-0 p-0 h-full border-0 gap-0 relative">
        {/* Sidebar - Segundo */}
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

        {/* Panel de versiones (roadmaps) */}
        {showRoadmapsPanel && (
          <div className="w-80 h-full bg-white border-l border-gray-200 z-30 flex flex-col shadow-none">
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

        {/* React Flow principal - Tercero */}
        <div className="react-flow-container m-0 p-0 h-full w-full border-0 flex-1 relative">
          {/* Panel lateral de componentes */}
          {showComponentsPanel && <ComponentsPanel
            showComponentsPanel={showComponentsPanel}
            onClose={() => setShowComponentsPanel(false)}
            searchComponents={searchComponents}
            onSearchChange={(e) => setSearchComponents(e.target.value)}
            filteredComponents={filteredComponents}
            onAddComponent={handleAddComponent}
          />}
          
          {/* React Flow principal */}
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
              className="w-full h-full"
            >
              <FlowWithFitView />
              <Controls />
              <Background 
                variant="lines" 
                gap={50} 
                size={1} 
                color="#ffffff"
                style={{ backgroundColor: 'transparent' }}
              />
            </ReactFlow>

          {/* Overlay para cerrar panel al hacer clic fuera */}
          {showPropertiesPanel && (
            <div 
              className="fixed inset-0 z-35 bg-transparent properties-overlay"
              onClick={handleClickOutside}
            />
          )}

          {/* Panel de propiedades */}
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
        </div>
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