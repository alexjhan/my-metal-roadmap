import React, { useState, useEffect, useCallback } from 'react';
import { Handle, Position } from 'reactflow';

const CustomNode = ({ id, data, selected, onClick }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [nodeData, setNodeData] = useState({
    label: data.label,
    description: data.description,
    icon: data.icon,
    color: data.color || '#ffffff',
    backgroundColor: data.backgroundColor || '#f3f4f6'
  });

  const handleDoubleClick = (e) => {
    // Activar modo de edición
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Actualizar los datos del nodo
    if (data.onUpdateNode) {
      data.onUpdateNode(id, 'label', nodeData.label);
      data.onUpdateNode(id, 'description', nodeData.description);
      data.onUpdateNode(id, 'icon', nodeData.icon);
      data.onUpdateNode(id, 'backgroundColor', nodeData.backgroundColor);
      data.onUpdateNode(id, 'color', nodeData.color);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNodeData({
      label: data.label,
      description: data.description,
      icon: data.icon,
      color: data.color || '#ffffff',
      backgroundColor: data.backgroundColor || '#f3f4f6'
    });
  };



  const toggleFormat = (format) => {
    const textarea = document.getElementById(`node-${data.id}-label`);
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      
      let newText = text;
      if (format === 'bold') {
        newText = text.substring(0, start) + `**${text.substring(start, end)}**` + text.substring(end);
      } else if (format === 'italic') {
        newText = text.substring(0, start) + `*${text.substring(start, end)}*` + text.substring(end);
      }
      
      setNodeData(prev => ({ ...prev, label: newText }));
      
      // Restaurar selección
      setTimeout(() => {
        textarea.setSelectionRange(start + (format === 'bold' ? 2 : 1), end + (format === 'bold' ? 2 : 1));
        textarea.focus();
      }, 0);
    }
  };

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
            <div className="w-full h-1 bg-gray-300 rounded-full"></div>
          </div>
        );

      case 'vertical-line':
        return (
          <div className="h-full flex flex-col justify-center items-center">
            <div className="w-1 h-full bg-gray-300 rounded-full"></div>
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

  if (isEditing) {
    return (
      <div className={`relative ${selected ? 'ring-2 ring-blue-500' : ''}`}>
        <Handle
          type="target"
          position={Position.Top}
          className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-400 border-2 border-white"
        />
        <div
          className="bg-white border-2 border-gray-300 rounded-lg shadow-md p-3 sm:p-4 min-w-[200px] sm:min-w-[220px] max-w-[300px]"
          style={{
            backgroundColor: nodeData.backgroundColor,
            color: nodeData.color
          }}
        >
          {/* Barra de herramientas de formato */}
          <div className="flex items-center space-x-2 mb-2 p-1 bg-gray-100 rounded">
            <button
              onClick={() => toggleFormat('bold')}
              className="px-2 py-1 text-xs font-bold hover:bg-gray-200 rounded"
              title="Negrita"
            >
              B
            </button>
            <button
              onClick={() => toggleFormat('italic')}
              className="px-2 py-1 text-xs italic hover:bg-gray-200 rounded"
              title="Cursiva"
            >
              I
            </button>
            <input
              type="color"
              value={nodeData.backgroundColor}
              onChange={(e) => setNodeData(prev => ({ ...prev, backgroundColor: e.target.value }))}
              className="w-6 h-6 rounded border"
              title="Color de fondo"
            />
          </div>

          {/* Formulario de edición */}
          <div className="space-y-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Icono</label>
              <input
                type="text"
                value={nodeData.icon}
                onChange={(e) => setNodeData(prev => ({ ...prev, icon: e.target.value }))}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                placeholder="🔥"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Título</label>
              <textarea
                id={`node-${id}-label`}
                value={nodeData.label}
                onChange={(e) => setNodeData(prev => ({ ...prev, label: e.target.value }))}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 resize-none"
                rows={2}
                placeholder="Título del concepto"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                value={nodeData.description}
                onChange={(e) => setNodeData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 resize-none"
                rows={3}
                placeholder="Descripción del concepto"
              />
            </div>

            {/* Propiedades específicas según el tipo de nodo */}
            {(data.nodeType || data.type) === 'button' && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">URL del enlace</label>
                <input
                  type="url"
                  value={data.url || ''}
                  onChange={(e) => {
                    if (data.onUpdateNode) {
                      data.onUpdateNode(id, 'url', e.target.value);
                    }
                  }}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  placeholder="https://ejemplo.com"
                />
              </div>
            )}

            {(data.nodeType || data.type) === 'todo' && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Estado</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={data.completed || false}
                    onChange={(e) => {
                      if (data.onUpdateNode) {
                        data.onUpdateNode(id, 'completed', e.target.checked);
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600"
                  />
                  <span className="text-xs text-gray-600">Marcado como completado</span>
                </div>
              </div>
            )}

            {/* Propiedades de estilo */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Color de fondo</label>
              <input
                type="color"
                value={nodeData.backgroundColor}
                onChange={(e) => setNodeData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                className="w-full h-8 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Color del texto</label>
              <input
                type="color"
                value={nodeData.color}
                onChange={(e) => setNodeData(prev => ({ ...prev, color: e.target.value }))}
                className="w-full h-8 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Tamaño de fuente</label>
              <input
                type="number"
                value={data.fontSize ? parseInt(data.fontSize) : 14}
                onChange={(e) => {
                  if (data.onUpdateNode) {
                    data.onUpdateNode(id, 'fontSize', `${e.target.value}px`);
                  }
                }}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                min="8"
                max="48"
                step="1"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Referencias Gratuitas</label>
              <textarea
                value={data.freeResources || ''}
                onChange={(e) => {
                  if (data.onUpdateResources) {
                    data.onUpdateResources('free', e.target.value);
                  }
                }}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 resize-none"
                rows={2}
                placeholder="Referencias gratuitas (una por línea)"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Referencias Premium</label>
              <textarea
                value={data.premiumResources || ''}
                onChange={(e) => {
                  if (data.onUpdateResources) {
                    data.onUpdateResources('premium', e.target.value);
                  }
                }}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 resize-none"
                rows={2}
                placeholder="Referencias premium (una por línea)"
              />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={handleCancel}
              className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Guardar
            </button>
          </div>
        </div>
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-400 border-2 border-white"
        />
      </div>
    );
  }

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
          backgroundColor: 'transparent',
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
          height: '4px',
          minHeight: '4px',
          maxHeight: '4px'
        };
      case 'vertical-line':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          border: 'none',
          boxShadow: 'none',
          width: '4px',
          minWidth: '4px',
          maxWidth: '4px'
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

  return (
    <div className={`relative ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-400 border-2 border-white"
      />
      
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
        onDoubleClick={handleDoubleClick}
      >
        {renderNodeContent()}
      </div>


    </div>
  );
};

export default CustomNode; 