import React from 'react';

const EditorHeader = ({ 
  roadmapInfo, 
  onShowToolsPanel, 
  showToolsPanel, 
  onPresentationMode, 
  presentationMode, 
  onShowLiveView, 
  onSave, 
  onEditModal,
  onExit
}) => {
  return (
    <div className="w-full bg-white border-b border-gray-100 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo y título */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <img src="/assets/logo.png" alt="Logo" className="w-8 h-8" />
            <div className="max-w-md">
              <h1 className="text-lg font-semibold text-gray-900">{roadmapInfo.title}</h1>
              <p className="text-xs text-gray-500 truncate">{roadmapInfo.description}</p>
            </div>
          </div>
          <button
            onClick={onEditModal}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            title="Editar título y descripción"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
        
        {/* Botones de acción mejorados */}
        <div className="flex items-center space-x-3">
          {/* Botón de modo presentación */}
          <button
            onClick={onPresentationMode}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              presentationMode 
                ? 'bg-green-100 text-green-600' 
                : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
            }`}
            title="Modo presentación"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>

          <button
            onClick={onShowLiveView}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <span className="hidden sm:inline">Vista</span>
            <span className="sm:hidden">👁️</span>
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Guardar
          </button>
          {/* Botón de salir */}
          <button
            onClick={onExit}
            className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
            title="Salir"
          >
            Salir
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditorHeader; 