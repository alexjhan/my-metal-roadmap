import React from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './CustomNode';

const nodeTypes = {
  custom: CustomNode,
};

function FlowWithFitView() {
  const { fitView } = useReactFlow();
  React.useEffect(() => {
    fitView({ padding: 0.2 });
  }, [fitView]);
  return null;
}

const LiveView = ({ nodes, edges, roadmapInfo, onClose }) => {
  return (
    <div className="fixed inset-0 bg-white z-50">
      {/* Header del Live View */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-3xl">{roadmapInfo.icon}</span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{roadmapInfo.title}</h1>
            <p className="text-sm text-gray-600">{roadmapInfo.description}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500 bg-green-100 text-green-800 px-3 py-1 rounded-full">
            Vista Previa
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Cerrar Vista</span>
          </button>
        </div>
      </div>

      {/* Área del mapa */}
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView={false}
          fitViewOptions={{ padding: 0.2, includeHiddenNodes: false }}
          defaultViewport={{ x: 0, y: 0, zoom: 0.6 }}
          minZoom={0.1}
          maxZoom={2}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnScroll={true}
          zoomOnScroll={true}
          panOnDrag={true}
          zoomOnPinch={true}
          panOnScrollMode="free"
          attributionPosition="bottom-left"
          preventScrolling={false}
          zoomOnDoubleClick={false}
          multiSelectionKeyCode={null}
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
  );
};

export default LiveView; 