import React from 'react';

export default function ConceptNode({ node, level, isSelected, isExpanded, onClick, onExpand }) {
  const getNodeSize = (level) => {
    switch (level) {
      case 0: return 'w-32 h-32'; // Nodo principal
      case 1: return 'w-28 h-28'; // Nodos secundarios
      case 2: return 'w-24 h-24'; // Nodos terciarios
      default: return 'w-20 h-20';
    }
  };

  const getNodeColors = (level, isSelected) => {
    if (isSelected) {
      return 'bg-blue-600 text-white border-2 border-blue-700';
    }
    
    switch (level) {
      case 0:
        return 'bg-orange-500 text-white border-2 border-orange-600';
      case 1:
        return 'bg-blue-500 text-white border-2 border-blue-600';
      case 2:
        return 'bg-green-500 text-white border-2 border-green-600';
      default:
        return 'bg-gray-500 text-white border-2 border-gray-600';
    }
  };

  const getIconSize = (level) => {
    switch (level) {
      case 0: return 'text-3xl';
      case 1: return 'text-2xl';
      case 2: return 'text-xl';
      default: return 'text-lg';
    }
  };

  const getTitleSize = (level) => {
    switch (level) {
      case 0: return 'text-sm font-bold';
      case 1: return 'text-xs font-semibold';
      case 2: return 'text-xs';
      default: return 'text-xs';
    }
  };

  return (
    <div 
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200`}
      style={{
        left: `${node.position.x}%`,
        top: `${node.position.y}%`,
        zIndex: level + 10
      }}
    >
      {/* Nodo principal */}
      <div
        className={`
          ${getNodeSize(level)} 
          ${getNodeColors(level, isSelected)}
          rounded-lg 
          flex flex-col items-center justify-center 
          cursor-pointer 
          transition-all duration-200
          hover:scale-105
        `}
        onClick={onClick}
      >
        <div className={`${getIconSize(level)} mb-1`}>
          {node.icon}
        </div>
        <div className={`${getTitleSize(level)} text-center px-2 leading-tight`}>
          {node.title}
        </div>
      </div>

      {/* Botón de expansión */}
      {node.children && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onExpand();
          }}
          className={`
            absolute -right-2 -top-2 
            w-6 h-6 
            bg-white 
            rounded-full 
            border border-gray-300
            flex items-center justify-center 
            text-gray-600 
            hover:text-blue-600 
            hover:border-blue-300
            transition-all duration-200
            ${isExpanded ? 'bg-blue-50 text-blue-600 border-blue-400' : ''}
          `}
        >
          <svg 
            className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-45' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      )}

      {/* Indicador de recursos */}
      {node.resources && node.resources.length > 0 && (
        <div className="absolute -left-1 -bottom-1">
          <div className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-bold">
            {node.resources.length}
          </div>
        </div>
      )}
    </div>
  );
} 