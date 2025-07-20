import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';

const CustomNode = React.memo(({ id, data, selected, onClick }) => {
  const { getConnectionLineStyle, getNode, getViewport } = useReactFlow();
  const [isConnectionActive, setIsConnectionActive] = useState(false);

  // Detectar cuando se está creando una conexión usando un intervalo optimizado
  useEffect(() => {
    let interval;
    
    const checkConnectionActive = () => {
      const connectionLine = document.querySelector('.react-flow__connection-line');
      const isActive = !!connectionLine;
      setIsConnectionActive(prev => prev !== isActive ? isActive : prev);
    };

    // Solo ejecutar el intervalo si el nodo está seleccionado o hay conexión activa
    if (selected || isConnectionActive) {
      interval = setInterval(checkConnectionActive, 100);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [selected, isConnectionActive]);

  // Memoizar la función de renderizado de texto formateado
  const renderFormattedText = useCallback((text) => {
    if (!text) return '';
    
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  }, []);

  // Memoizar el contenido del nodo
  const nodeContent = useMemo(() => {
    const nodeType = data.nodeType || data.type || 'default';
    const fontSize = data.fontSize || '14px';
    const label = data.label || '';
    
    switch (nodeType) {
      case 'title':
        return (
          <div className="flex flex-col items-center text-center">
            <h1 
              className="font-bold text-gray-900 text-lg leading-tight"
              style={{ fontSize: data.fontSize || '24px' }}
              dangerouslySetInnerHTML={{ __html: renderFormattedText(label) }}
            />
          </div>
        );

      case 'topic':
        return (
          <div className="flex flex-col items-center text-center">
            <h2 
              className="font-semibold text-gray-900 text-base leading-tight"
              style={{ fontSize: data.fontSize || '18px' }}
              dangerouslySetInnerHTML={{ __html: renderFormattedText(label) }}
            />
          </div>
        );

      case 'subtopic':
        return (
          <div className="flex flex-col items-center text-center">
            <h3 
              className="font-medium text-gray-900 text-sm leading-tight"
              style={{ fontSize: data.fontSize || '16px' }}
              dangerouslySetInnerHTML={{ __html: renderFormattedText(label) }}
            />
          </div>
        );

      case 'paragraph':
        return (
          <div className="text-center">
            <p 
              className="text-sm text-gray-900 leading-relaxed"
              style={{ fontSize: data.fontSize || '14px' }}
              dangerouslySetInnerHTML={{ __html: renderFormattedText(label) }}
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
              {label}
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
              dangerouslySetInnerHTML={{ __html: renderFormattedText(label) }}
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
              dangerouslySetInnerHTML={{ __html: renderFormattedText(label) }}
            />
          </div>
        );
    }
  }, [data, renderFormattedText]);

  // Memoizar los estilos del nodo
  const nodeStyles = useMemo(() => {
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
      overflow: 'visible'
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
          color: data.color || '#1f2937'
        };

      case 'topic':
        return {
          ...baseStyles,
          backgroundColor: data.backgroundColor || '#f3f4f6',
          border: data.border || '2px solid #d1d5db',
          fontSize: data.fontSize || '18px',
          fontWeight: '600',
          color: data.color || '#374151'
        };

      case 'subtopic':
        return {
          ...baseStyles,
          backgroundColor: data.backgroundColor || '#ffffff',
          border: data.border || '1px solid #e5e7eb',
          fontSize: data.fontSize || '16px',
          fontWeight: '500',
          color: data.color || '#4b5563'
        };

      case 'paragraph':
        return {
          ...baseStyles,
          backgroundColor: data.backgroundColor || '#ffffff',
          border: data.border || '1px solid #e5e7eb',
          fontSize: data.fontSize || '14px',
          color: data.color || '#6b7280',
          textAlign: 'left',
          padding: data.padding || '16px'
        };

      case 'button':
        return {
          ...baseStyles,
          backgroundColor: data.backgroundColor || '#1e40af',
          border: data.border || 'none',
          color: data.color || '#ffffff',
          fontSize: data.fontSize || '14px',
          fontWeight: '500',
          cursor: 'pointer',
          minWidth: data.minWidth || '100px',
          minHeight: data.minHeight || '40px'
        };

      case 'todo':
        return {
          ...baseStyles,
          backgroundColor: data.backgroundColor || '#ffffff',
          border: data.border || '1px solid #e5e7eb',
          fontSize: data.fontSize || '14px',
          color: data.color || '#374151',
          textAlign: 'left',
          padding: data.padding || '12px'
        };

      case 'horizontal-line':
      case 'vertical-line':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          border: 'none',
          boxShadow: 'none',
          padding: '0px',
          minWidth: 'auto',
          minHeight: 'auto'
        };

      default:
        return {
          ...baseStyles,
          backgroundColor: data.backgroundColor || '#ffffff',
          border: data.border || '1px solid #e5e7eb',
          fontSize: data.fontSize || '16px',
          color: data.color || '#374151'
        };
    }
  }, [data]);

  // Memoizar el manejador de clic
  // const handleClick = useCallback((event) => {
  //   event.stopPropagation();
  //   if (onClick) {
  //     onClick(id);
  //   }
  // }, [onClick, id]);

  // Memoizar los handles
  const handles = useMemo(() => {
    const nodeType = data.nodeType || data.type || 'default';
    
    // No mostrar handles para líneas
    if (nodeType === 'horizontal-line' || nodeType === 'vertical-line') {
      return null;
    }

    return (
      <>
        <Handle
          type="target"
          position={Position.Top}
          id="top"
          style={{
            background: isConnectionActive ? '#10b981' : '#6b7280',
            width: '16px',
            height: '16px',
            border: '3px solid white',
            top: '-8px',
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        />
        <Handle
          type="source"
          position={Position.Top}
          id="top"
          style={{
            background: isConnectionActive ? '#10b981' : '#6b7280',
            width: '16px',
            height: '16px',
            border: '3px solid white',
            top: '-8px',
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        />
        <Handle
          type="target"
          position={Position.Right}
          id="right"
          style={{
            background: isConnectionActive ? '#10b981' : '#6b7280',
            width: '16px',
            height: '16px',
            border: '3px solid white',
            right: '-8px',
            top: '50%',
            transform: 'translateY(-50%)'
          }}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="right"
          style={{
            background: isConnectionActive ? '#10b981' : '#6b7280',
            width: '16px',
            height: '16px',
            border: '3px solid white',
            right: '-8px',
            top: '50%',
            transform: 'translateY(-50%)'
          }}
        />
        <Handle
          type="target"
          position={Position.Bottom}
          id="bottom"
          style={{
            background: isConnectionActive ? '#10b981' : '#6b7280',
            width: '16px',
            height: '16px',
            border: '3px solid white',
            bottom: '-8px',
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="bottom"
          style={{
            background: isConnectionActive ? '#10b981' : '#6b7280',
            width: '16px',
            height: '16px',
            border: '3px solid white',
            bottom: '-8px',
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        />
        <Handle
          type="target"
          position={Position.Left}
          id="left"
          style={{
            background: isConnectionActive ? '#10b981' : '#6b7280',
            width: '16px',
            height: '16px',
            border: '3px solid white',
            left: '-8px',
            top: '50%',
            transform: 'translateY(-50%)'
          }}
        />
        <Handle
          type="source"
          position={Position.Left}
          id="left"
          style={{
            background: isConnectionActive ? '#10b981' : '#6b7280',
            width: '16px',
            height: '16px',
            border: '3px solid white',
            left: '-8px',
            top: '50%',
            transform: 'translateY(-50%)'
          }}
        />
      </>
    );
  }, [isConnectionActive, data.nodeType, data.type]);

  return (
    <div
      data-id={id}
      style={{
        ...nodeStyles,
        border: selected ? '2px solid #3b82f6' : nodeStyles.border,
        boxShadow: selected ? '0 0 0 2px rgba(59, 130, 246, 0.2)' : nodeStyles.boxShadow
      }}
      // onClick={handleClick} // Eliminado para que el click lo maneje React Flow
      className={`custom-node moveable-node ${selected ? 'selected' : ''}`}
    >
      {handles}
      {nodeContent}
    </div>
  );
});

CustomNode.displayName = 'CustomNode';

export default CustomNode; 