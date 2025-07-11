import React, { useCallback, useState, useEffect } from 'react';
import ReactFlow, { MiniMap, Controls, Background, addEdge, useNodesState, useEdgesState } from 'react-flow-renderer';
import { FiPlus, FiTrash2, FiSave } from 'react-icons/fi';
import { supabase, roadmapService } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Concepto inicial' },
    position: { x: 250, y: 5 },
  },
];

const initialEdges = [];

export default function CreateRoadmap() {
  const navigate = useNavigate();
  const { user, loading } = useUser();
  const [roadmapData, setRoadmapData] = useState({
    emoji: '🔥',
    title: '',
    description: '',
    nodes: []
  });

  const [newNode, setNewNode] = useState({
    label: '',
    description: '',
    icon: '📚'
  });

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  useEffect(() => {
    // Verificar si el usuario está autenticado
    if (!loading && !user) {
      alert('Debes iniciar sesión para crear roadmaps');
      navigate('/');
      return;
    }
  }, [user, loading, navigate]);

  const addNode = () => {
    if (newNode.label.trim()) {
      setRoadmapData(prev => ({
        ...prev,
        nodes: [...prev.nodes, { ...newNode, id: Date.now() }]
      }));
      setNewNode({ label: '', description: '', icon: '📚' });
    }
  };

  const removeNode = (nodeId) => {
    setRoadmapData(prev => ({
      ...prev,
      nodes: prev.nodes.filter(node => node.id !== nodeId)
    }));
  };

  const saveRoadmap = async () => {
    if (!user) {
      alert('Debes iniciar sesión para guardar roadmaps');
      return;
    }

    if (!roadmapData.title || roadmapData.nodes.length === 0) {
      alert('Completa el título y agrega al menos un concepto');
      return;
    }

    try {
      // Crear el roadmap
      const roadmap = await roadmapService.createRoadmap(user.id, roadmapData);
      
      // Crear los nodos
      for (const node of roadmapData.nodes) {
        await roadmapService.createNode(roadmap.id, node);
      }

      alert('Roadmap guardado exitosamente!');
      navigate('/');
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar el roadmap: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[calc(100vh-80px)] bg-gray-50 flex flex-col">
      {/* Barra superior */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">Editor de Roadmap</h1>
        {/* Aquí puedes agregar botones de guardar, exportar, etc. */}
      </div>
      {/* Área de React Flow */}
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background gap={16} color="#e5e7eb" />
        </ReactFlow>
      </div>
    </div>
  );
} 