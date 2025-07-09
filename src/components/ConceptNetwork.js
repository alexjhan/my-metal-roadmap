import React, { useState, useRef } from 'react';
import ConceptNode from './ConceptNode';
import ConnectionLine from './ConnectionLine';
import { useParams } from 'react-router-dom';

export default function ConceptNetwork() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const containerRef = useRef(null);
  const { tema } = useParams();

  // Cargar la red de conceptos según el tema (por ejemplo, termodinamica, frontend, etc.)
  const conceptData = {
    id: 'termodinamica',
    title: 'Termodinámica',
    description: 'Ciencia que estudia las transformaciones de energía en sistemas físicos',
    icon: '🔥',
    position: { x: 50, y: 50 },
    children: [
      {
        id: 'primera-ley',
        title: 'Primera Ley',
        description: 'Conservación de la energía',
        icon: '⚡',
        position: { x: 20, y: 20 },
        children: [
          {
            id: 'energia-interna',
            title: 'Energía Interna',
            description: 'Energía total de un sistema',
            icon: '🔋',
            position: { x: 10, y: 10 },
            resources: [
              { type: 'video', title: 'Energía Interna', url: '#', duration: '5:30' },
              { type: 'article', title: 'Conceptos Básicos', url: '#' },
              { type: 'simulation', title: 'Simulador Interactivo', url: '#' }
            ]
          },
          {
            id: 'trabajo-calor',
            title: 'Trabajo y Calor',
            description: 'Formas de transferencia de energía',
            icon: '🌡️',
            position: { x: 30, y: 10 },
            resources: [
              { type: 'video', title: 'Trabajo vs Calor', url: '#', duration: '8:15' },
              { type: 'article', title: 'Transferencia de Energía', url: '#' }
            ]
          }
        ],
        resources: [
          { type: 'video', title: 'Primera Ley de la Termodinámica', url: '#', duration: '12:45' },
          { type: 'article', title: 'Conservación de la Energía', url: '#' },
          { type: 'simulation', title: 'Experimento Virtual', url: '#' }
        ]
      },
      {
        id: 'segunda-ley',
        title: 'Segunda Ley',
        description: 'Entropía y espontaneidad',
        icon: '🔄',
        position: { x: 80, y: 20 },
        children: [
          {
            id: 'entropia',
            title: 'Entropía',
            description: 'Medida del desorden molecular',
            icon: '📈',
            position: { x: 70, y: 10 },
            resources: [
              { type: 'video', title: 'Entropía Explicada', url: '#', duration: '10:20' },
              { type: 'article', title: 'Desorden Molecular', url: '#' }
            ]
          },
          {
            id: 'espontaneidad',
            title: 'Espontaneidad',
            description: 'Criterios de reacciones espontáneas',
            icon: '🎯',
            position: { x: 90, y: 10 },
            resources: [
              { type: 'video', title: 'Reacciones Espontáneas', url: '#', duration: '7:30' },
              { type: 'simulation', title: 'Predicción de Espontaneidad', url: '#' }
            ]
          }
        ],
        resources: [
          { type: 'video', title: 'Segunda Ley de la Termodinámica', url: '#', duration: '15:20' },
          { type: 'article', title: 'Entropía y Espontaneidad', url: '#' }
        ]
      },
      {
        id: 'energia-gibbs',
        title: 'Energía de Gibbs',
        description: 'Criterio de espontaneidad',
        icon: '⚖️',
        position: { x: 50, y: 80 },
        children: [
          {
            id: 'delta-g',
            title: 'ΔG = ΔH - TΔS',
            description: 'Ecuación fundamental',
            icon: '🧮',
            position: { x: 40, y: 70 },
            resources: [
              { type: 'video', title: 'Cálculo de ΔG', url: '#', duration: '9:45' },
              { type: 'simulation', title: 'Calculadora ΔG', url: '#' }
            ]
          },
          {
            id: 'aplicaciones',
            title: 'Aplicaciones',
            description: 'Uso en procesos metalúrgicos',
            icon: '🏭',
            position: { x: 60, y: 70 },
            resources: [
              { type: 'video', title: 'Aplicaciones Industriales', url: '#', duration: '11:30' },
              { type: 'article', title: 'Procesos Metalúrgicos', url: '#' }
            ]
          }
        ],
        resources: [
          { type: 'video', title: 'Energía Libre de Gibbs', url: '#', duration: '13:15' },
          { type: 'article', title: 'Criterio de Espontaneidad', url: '#' },
          { type: 'simulation', title: 'Simulador ΔG', url: '#' }
        ]
      }
    ],
    resources: [
      { type: 'video', title: 'Introducción a la Termodinámica', url: '#', duration: '20:30' },
      { type: 'article', title: 'Fundamentos Termodinámicos', url: '#' },
      { type: 'simulation', title: 'Laboratorio Virtual', url: '#' },
      { type: 'book', title: 'Termodinámica Metalúrgica', url: '#' }
    ]
  };

  const handleNodeClick = (nodeId) => {
    if (selectedNode === nodeId) {
      setSelectedNode(null);
    } else {
      setSelectedNode(nodeId);
    }
  };

  const toggleNodeExpansion = (nodeId) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const renderNode = (node, level = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedNode === node.id;

    return (
      <div key={node.id} className="relative">
        <ConceptNode
          node={node}
          level={level}
          isSelected={isSelected}
          isExpanded={isExpanded}
          onClick={() => handleNodeClick(node.id)}
          onExpand={() => toggleNodeExpansion(node.id)}
        />
        
        {node.children && isExpanded && (
          <div className="relative">
            {node.children.map((child, index) => (
              <div key={child.id} className="relative">
                <ConnectionLine
                  from={node.position}
                  to={child.position}
                  level={level + 1}
                />
                {renderNode(child, level + 1)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Red de Conceptos: {tema.charAt(0).toUpperCase() + tema.slice(1)}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explora los conceptos de {tema.charAt(0).toUpperCase() + tema.slice(1)} de forma interactiva. 
            Haz click en cualquier nodo para ver detalles y recursos.
          </p>
        </div>

        <div 
          ref={containerRef}
          className="relative w-full h-[600px] bg-gray-50 border rounded-lg overflow-hidden"
        >
          {renderNode(conceptData)}
        </div>

        {/* Panel lateral para recursos */}
        {selectedNode && (
          <div className="fixed right-0 top-0 h-full w-80 bg-white border-l shadow-lg z-50">
            <ResourcePanel 
              nodeId={selectedNode}
              conceptData={conceptData}
              onClose={() => setSelectedNode(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Componente para el panel de recursos
function ResourcePanel({ nodeId, conceptData, onClose }) {
  const findNode = (node, id) => {
    if (node.id === id) return node;
    if (node.children) {
      for (const child of node.children) {
        const found = findNode(child, id);
        if (found) return found;
      }
    }
    return null;
  };

  const node = findNode(conceptData, nodeId);

  if (!node) return null;

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b bg-gray-50">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{node.icon} {node.title}</h2>
            <p className="text-gray-600 text-sm mt-1">{node.description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Recursos</h3>
            <div className="space-y-2">
              {node.resources?.map((resource, index) => (
                <div key={index} className="border rounded p-3 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="text-lg">
                      {resource.type === 'video' && '🎥'}
                      {resource.type === 'article' && '📄'}
                      {resource.type === 'simulation' && '🧪'}
                      {resource.type === 'book' && '📚'}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{resource.title}</h4>
                      {resource.duration && (
                        <p className="text-sm text-gray-500">{resource.duration}</p>
                      )}
                    </div>
                    <button className="text-blue-600 hover:text-blue-800">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {node.children && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Conceptos Relacionados</h3>
              <div className="space-y-2">
                {node.children.map((child) => (
                  <div key={child.id} className="border rounded p-3 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{child.icon}</span>
                      <span className="font-medium text-gray-900">{child.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 