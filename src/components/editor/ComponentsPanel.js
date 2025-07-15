import React from 'react';

const ComponentsPanel = ({ 
  showComponentsPanel, 
  onClose, 
  searchComponents, 
  onSearchChange, 
  filteredComponents, 
  onAddComponent 
}) => {
  if (!showComponentsPanel) return null;

  const handleDragStart = (e, component) => {
    e.dataTransfer.setData('application/json', JSON.stringify(component));
  };

  return (
    <div className="absolute left-0 top-0 w-80 h-full bg-white border-r border-gray-200 z-20 flex flex-col shadow-lg">
      {/* Header minimalista */}
      <div className="flex items-center px-4 py-3 border-b border-gray-100">
        <span className="font-medium text-gray-700 text-base">Componentes</span>
        <button
          onClick={onClose}
          className="ml-auto text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Buscador */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar componentes..."
            value={searchComponents}
            onChange={onSearchChange}
            className="w-full px-3 py-2 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      
      {/* Lista de componentes */}
      <div className="flex-1 overflow-y-auto p-4 bg-white">
        <div className="space-y-2">
          {filteredComponents.map((component) => (
            <div
              key={component.id}
              draggable
              onDragStart={(e) => handleDragStart(e, component)}
              className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-move bg-white"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{component.icon}</span>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm">{component.name}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComponentsPanel; 