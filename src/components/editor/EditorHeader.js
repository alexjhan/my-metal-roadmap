import React from 'react';

const EditorHeader = ({ 
  roadmapInfo, 
  zoomLevel, 
  onZoomIn, 
  onZoomOut, 
  onFitView, 
  onShowToolsPanel, 
  showToolsPanel, 
  onPresentationMode, 
  presentationMode, 
  onShowLiveView, 
  onSave, 
  onEditModal 
}) => {
  return (
    <div className="w-full bg-white border-b border-gray-100 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Título y descripción */}
        <div className="flex items-center space-x-4">
          <div className="max-w-md">
            <h1 className="text-lg font-semibold text-gray-900">{roadmapInfo.title}</h1>
            <p className="text-xs text-gray-500 truncate">{roadmapInfo.description}</p>
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
          {/* Herramientas de zoom */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={onZoomOut}
              className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
              title="Zoom out"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="text-xs text-gray-500 px-2">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={onZoomIn}
              className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
              title="Zoom in"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button
              onClick={onFitView}
              className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
              title="Fit view"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          </div>

          {/* Botón de herramientas */}
          <button
            onClick={onShowToolsPanel}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              showToolsPanel 
                ? 'bg-blue-100 text-blue-600' 
                : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
            }`}
            title="Herramientas"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

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
        </div>
      </div>
    </div>
  );
};

export default EditorHeader; 