import React, { useState } from 'react';
import { FiPlus, FiTrash2, FiSave } from 'react-icons/fi';

export default function CreateRoadmap() {
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

  const saveRoadmap = () => {
    // Aquí se implementaría la lógica para guardar el roadmap
    console.log('Roadmap guardado:', roadmapData);
    alert('Roadmap guardado exitosamente!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Crear Nuevo Roadmap</h1>
              <p className="text-gray-600">Crea tu propio roadmap personalizado con conceptos y recursos</p>
            </div>

            {/* Formulario principal */}
            <div className="space-y-6">
              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Emoji */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emoji
                  </label>
                  <input
                    type="text"
                    value={roadmapData.emoji}
                    onChange={(e) => setRoadmapData(prev => ({ ...prev, emoji: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="🔥"
                  />
                </div>

                {/* Título */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título
                  </label>
                  <input
                    type="text"
                    value={roadmapData.title}
                    onChange={(e) => setRoadmapData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: Termodinámica Avanzada"
                  />
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={roadmapData.description}
                  onChange={(e) => setRoadmapData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe brevemente el contenido de tu roadmap..."
                />
              </div>

              {/* Agregar nodo */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Agregar Conceptos</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <input
                    type="text"
                    value={newNode.icon}
                    onChange={(e) => setNewNode(prev => ({ ...prev, icon: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="📚"
                  />
                  <input
                    type="text"
                    value={newNode.label}
                    onChange={(e) => setNewNode(prev => ({ ...prev, label: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nombre del concepto"
                  />
                  <button
                    onClick={addNode}
                    className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <FiPlus className="mr-2" />
                    Agregar
                  </button>
                </div>

                <textarea
                  value={newNode.description}
                  onChange={(e) => setNewNode(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
                  placeholder="Descripción del concepto..."
                />
              </div>

              {/* Lista de nodos */}
              {roadmapData.nodes.length > 0 && (
                <div className="border-t pt-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Conceptos Agregados</h4>
                  <div className="space-y-3">
                    {roadmapData.nodes.map((node) => (
                      <div key={node.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-xl">{node.icon}</span>
                          <div>
                            <h5 className="font-medium text-gray-900">{node.label}</h5>
                            <p className="text-sm text-gray-600">{node.description}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeNode(node.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Botón guardar */}
              <div className="border-t pt-6">
                <button
                  onClick={saveRoadmap}
                  disabled={!roadmapData.title || roadmapData.nodes.length === 0}
                  className="flex items-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <FiSave className="mr-2" />
                  Guardar Roadmap
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 