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
  onExit,
  saveStatus = 'idle',
  hasUnsavedChanges = false,
  proposalMode = false,
  onToggleProposalMode = () => {},
  onCreateProposal = () => {}
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
          {/* Botón de modo propuesta */}
          <button
            onClick={onToggleProposalMode}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              proposalMode 
                ? 'bg-orange-100 text-orange-600' 
                : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
            }`}
            title="Modo propuesta de edición"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>

          <button
            onClick={onShowLiveView}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <span className="hidden sm:inline">Vista</span>
            <span className="sm:hidden">👁️</span>
          </button>
          {proposalMode ? (
            <button
              onClick={onCreateProposal}
              className="px-4 py-2 text-sm font-medium bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Crear Propuesta</span>
            </button>
          ) : (
            <button
              onClick={onSave}
              disabled={saveStatus === 'saving'}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center space-x-2 ${
                saveStatus === 'saving' 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : hasUnsavedChanges 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {saveStatus === 'saving' ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Guardando...</span>
                </>
              ) : hasUnsavedChanges ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  <span>Guardar</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Guardado</span>
                </>
              )}
            </button>
          )}
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