import React from 'react';

const Sidebar = ({ 
  showComponentsPanel, 
  showRoadmapsPanel, 
  onToggleComponentsPanel, 
  onToggleRoadmapsPanel 
}) => {
  return (
    <div className="w-12 h-full bg-white flex flex-col items-center justify-start z-30 border-r border-gray-200">
      {/* Botón Componentes */}
      <button
        onClick={onToggleComponentsPanel}
        className={`w-10 h-10 mt-2 mb-1 flex items-center justify-center rounded transition-colors hover:bg-blue-50 ${showComponentsPanel ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
        title="Componentes"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </button>
      
      {/* Botón Roadmaps */}
      <button
        onClick={onToggleRoadmapsPanel}
        disabled
        className={`w-10 h-10 mt-1 mb-2 flex items-center justify-center rounded transition-colors text-gray-400 bg-gray-100 cursor-not-allowed`}
        title="Roadmaps"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      </button>
    </div>
  );
};

export default Sidebar; 