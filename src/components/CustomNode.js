import React, { useState, useEffect, useCallback } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';

const CustomNode = ({ id, data, selected, onClick }) => {
  const { getConnectionLineStyle, getNode, getViewport } = useReactFlow();
  const [isConnectionActive, setIsConnectionActive] = useState(false);

  // Detectar cuando se está creando una conexión usando un intervalo
  useEffect(() => {
    const checkConnectionActive = () => {
      const connectionLine = document.querySelector('.react-flow__connection-line');
      setIsConnectionActive(!!connectionLine);
    };

    const interval = setInterval(checkConnectionActive, 100);
    
    return () => clearInterval(interval);
  }, []);



  // Eliminada la función toggleFormat ya que no se usa más

  const renderFormattedText = (text) => {
    // Renderizar texto con formato markdown básico
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  };

  const renderNodeContent = () => {
    const nodeType = data.nodeType || data.type || 'default';
    
    switch (nodeType) {
      case 'title':
        return (
          <div className="flex flex-col items-center text-center">
            <h1 
              className="font-bold text-gray-900 text-lg leading-tight"
              style={{ fontSize: data.fontSize || '24px' }}
              dangerouslySetInnerHTML={{ __html: renderFormattedText(data.label) }}
            />
          </div>
        );

      case 'topic':
        return (
          <div className="flex flex-col items-center text-center">
            <h2 
              className="font-semibold text-gray-900 text-base leading-tight"
              style={{ fontSize: data.fontSize || '18px' }}
              dangerouslySetInnerHTML={{ __html: renderFormattedText(data.label) }}
            />
          </div>
        );

      case 'subtopic':
        return (
          <div className="flex flex-col items-center text-center">
            <h3 
              className="font-medium text-gray-900 text-sm leading-tight"
              style={{ fontSize: data.fontSize || '16px' }}
              dangerouslySetInnerHTML={{ __html: renderFormattedText(data.label) }}
            />
          </div>
        );

      case 'paragraph':
        return (
          <div className="text-center">
            <p 
              className="text-sm text-gray-900 leading-relaxed"
              style={{ fontSize: data.fontSize || '14px' }}
              dangerouslySetInnerHTML={{ __html: renderFormattedText(data.label) }}
            />
          </div>
        );

      case 'button':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center text-center">
            <button 
              className="w-full h-full bg-blue-800 text-white text-sm rounded hover:bg-blue-900 transition-colors flex items-center justify-center"
              style={{ fontSize: data.fontSize || '14px' }}
            >
              {data.label}
            </button>
            {data.url && (
              <a 
                href={data.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-600 mt-1"
              >
                Abrir enlace
              </a>
            )}
          </div>
        );

      case 'todo':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={data.completed || false}
              readOnly
              className="rounded border-gray-300 text-blue-600 flex-shrink-0"
            />
            <span 
              className={`text-sm leading-tight flex-1 ${data.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}
              style={{ fontSize: data.fontSize || '14px' }}
              dangerouslySetInnerHTML={{ __html: renderFormattedText(data.label) }}
            />
          </div>
        );

      case 'horizontal-line':
        return (
          <div className="w-full flex justify-center items-center">
            <div 
              className="rounded-full"
              style={{
                height: `${data.lineWidth || 2}px`,
                width: `${data.lineSize || 100}px`,
                backgroundColor: data.lineStyle === 'solid' ? (data.lineColor || '#6B7280') : 'transparent',
                border: data.lineStyle !== 'solid' ? `${data.lineWidth || 2}px ${data.lineStyle || 'solid'} ${data.lineColor || '#6B7280'}` : 'none',
                borderStyle: data.lineStyle || 'solid',
                borderWidth: data.lineStyle !== 'solid' ? `${data.lineWidth || 2}px` : '0px',
                borderColor: data.lineColor || '#6B7280'
              }}
            ></div>
          </div>
        );

      case 'vertical-line':
        return (
          <div className="h-full flex flex-col justify-center items-center">
            <div 
              className="rounded-full"
              style={{
                width: `${data.lineWidth || 2}px`,
                height: `${data.lineSize || 100}px`,
                backgroundColor: data.lineStyle === 'solid' ? (data.lineColor || '#6B7280') : 'transparent',
                border: data.lineStyle !== 'solid' ? `${data.lineWidth || 2}px ${data.lineStyle || 'solid'} ${data.lineColor || '#6B7280'}` : 'none',
                borderStyle: data.lineStyle || 'solid',
                borderWidth: data.lineStyle !== 'solid' ? `${data.lineWidth || 2}px` : '0px',
                borderColor: data.lineColor || '#6B7280'
              }}
            ></div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center text-center">
            <h3 
              className="font-medium text-gray-900 text-sm leading-tight"
              style={{ fontSize: data.fontSize || '16px' }}
              dangerouslySetInnerHTML={{ __html: renderFormattedText(data.label) }}
            />
          </div>
        );
    }
  };

  // Eliminado el modo de edición inline
  // La edición ahora se maneja a través del off-canvas

  // Determinar estilos del nodo según el tipo
  const getNodeStyles = () => {
    const nodeType = data.nodeType || data.type || 'default';
    const baseStyles = {
      width: data.width || 'auto',
      height: data.height || 'auto',
      minWidth: data.minWidth || '120px',
      minHeight: data.minHeight || '60px',
      maxWidth: data.maxWidth || '300px',
      maxHeight: data.maxHeight || '200px',
      fontSize: data.fontSize || '14px',
      padding: data.padding || '12px',
      borderRadius: data.borderRadius || '8px',
      border: data.border || '1px solid #e5e7eb',
      boxShadow: data.boxShadow || '0 2px 4px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      wordWrap: 'break-word',
      overflow: 'hidden'
    };

    switch (nodeType) {
      case 'title':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          border: 'none',
          boxShadow: 'none',
          fontSize: data.fontSize || '24px',
          fontWeight: 'bold',
          color: '#111827'
        };
      case 'topic':
        return {
          ...baseStyles,
          backgroundColor: data.backgroundColor || '#fef3c7',
          border: 'none',
          fontSize: data.fontSize || '18px',
          fontWeight: '600',
          color: '#92400e'
        };
      case 'subtopic':
        return {
          ...baseStyles,
          backgroundColor: data.backgroundColor || '#fef08a',
          border: '2px solid #eab308',
          fontSize: data.fontSize || '16px',
          fontWeight: '500',
          color: '#a16207'
        };
      case 'paragraph':
        return {
          ...baseStyles,
          backgroundColor: data.backgroundColor || 'transparent',
          border: 'none',
          boxShadow: 'none',
          fontSize: data.fontSize || '14px',
          color: '#374151'
        };
      case 'button':
        return {
          ...baseStyles,
          backgroundColor: '#1e40af',
          border: 'none',
          color: 'white',
          fontSize: data.fontSize || '14px',
          fontWeight: '500',
          cursor: 'pointer'
        };
      case 'todo':
        return {
          ...baseStyles,
          backgroundColor: data.backgroundColor || '#f3f4f6',
          border: '2px solid #d1d5db',
          fontSize: data.fontSize || '14px',
          color: '#374151',
          justifyContent: 'flex-start',
          padding: '8px 12px'
        };
      case 'horizontal-line':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          border: 'none',
          boxShadow: 'none',
          height: `${data.lineWidth || 2}px`,
          minHeight: `${data.lineWidth || 2}px`,
          maxHeight: `${data.lineWidth || 2}px`,
          width: `${data.lineSize || 100}px`,
          minWidth: `${data.lineSize || 100}px`,
          maxWidth: `${data.lineSize || 100}px`
        };
      case 'vertical-line':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          border: 'none',
          boxShadow: 'none',
          width: `${data.lineWidth || 2}px`,
          minWidth: `${data.lineWidth || 2}px`,
          maxWidth: `${data.lineWidth || 2}px`,
          height: `${data.lineSize || 100}px`,
          minHeight: `${data.lineSize || 100}px`,
          maxHeight: `${data.lineSize || 100}px`
        };
      default:
        return {
          ...baseStyles,
          backgroundColor: data.backgroundColor || '#f3f4f6',
          border: '2px solid #d1d5db',
          fontSize: data.fontSize || '16px',
          color: '#374151'
        };
    }
  };

  const nodeStyles = getNodeStyles();

  const nodeType = data.nodeType || data.type || 'default';
  const isLine = nodeType === 'horizontal-line' || nodeType === 'vertical-line';

  return (
    <div className={`relative ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      {/* 4 handles de conexión para nodos que no son líneas */}
      {!isLine && (
        <>
          {/* Área de captura sombreada cuando se está creando una conexión */}
          {isConnectionActive && (
            <>
              <div 
                className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-blue-200 rounded-full opacity-50 pointer-events-none"
                style={{ zIndex: 1 }}
              />
              <div 
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-8 h-8 bg-blue-200 rounded-full opacity-50 pointer-events-none"
                style={{ zIndex: 1 }}
              />
              <div 
                className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-blue-200 rounded-full opacity-50 pointer-events-none"
                style={{ zIndex: 1 }}
              />
              <div 
                className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-blue-200 rounded-full opacity-50 pointer-events-none"
                style={{ zIndex: 1 }}
              />
            </>
          )}
          
          <Handle
            id="top"
            type="target"
            position={Position.Top}
            className={`transition-all duration-200 ease-in-out border-2 border-white ${
              isConnectionActive ? 'w-6 h-6' : 'w-3 h-3'
            } bg-navy-600`}
            style={{ 
              backgroundColor: '#1e3a8a',
              transform: isConnectionActive ? 'scale(1.5)' : 'scale(1)',
              boxShadow: isConnectionActive ? '0 0 10px rgba(30, 58, 138, 0.5)' : 'none',
              zIndex: 2
            }}
          />
          <Handle
            id="bottom"
            type="source"
            position={Position.Bottom}
            className={`transition-all duration-200 ease-in-out border-2 border-white ${
              isConnectionActive ? 'w-6 h-6' : 'w-3 h-3'
            } bg-navy-600`}
            style={{ 
              backgroundColor: '#1e3a8a',
              transform: isConnectionActive ? 'scale(1.5)' : 'scale(1)',
              boxShadow: isConnectionActive ? '0 0 10px rgba(30, 58, 138, 0.5)' : 'none',
              zIndex: 2
            }}
          />
          <Handle
            id="left"
            type="source"
            position={Position.Left}
            className={`transition-all duration-200 ease-in-out border-2 border-white ${
              isConnectionActive ? 'w-6 h-6' : 'w-3 h-3'
            } bg-navy-600`}
            style={{ 
              backgroundColor: '#1e3a8a',
              transform: isConnectionActive ? 'scale(1.5)' : 'scale(1)',
              boxShadow: isConnectionActive ? '0 0 10px rgba(30, 58, 138, 0.5)' : 'none',
              zIndex: 2
            }}
          />
          <Handle
            id="right"
            type="source"
            position={Position.Right}
            className={`transition-all duration-200 ease-in-out border-2 border-white ${
              isConnectionActive ? 'w-6 h-6' : 'w-3 h-3'
            } bg-navy-600`}
            style={{ 
              backgroundColor: '#1e3a8a',
              transform: isConnectionActive ? 'scale(1.5)' : 'scale(1)',
              boxShadow: isConnectionActive ? '0 0 10px rgba(30, 58, 138, 0.5)' : 'none',
              zIndex: 2
            }}
          />
        </>
      )}
      
      <div
        className="node-button"
        style={nodeStyles}
        onClick={(e) => {
          e.stopPropagation();
          if (data.onNodeClick) {
            data.onNodeClick(id);
          }
          if (onClick) {
            onClick(e);
          }
        }}
      >
        {renderNodeContent()}
      </div>
    </div>
  );
};

export default CustomNode; 