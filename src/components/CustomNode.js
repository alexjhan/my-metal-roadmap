import React, { useState } from 'react';
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
    // Prevenir el doble click para evitar el modo de edición inline
    e.preventDefault();
    e.stopPropagation();
  };

  const handleSave = () => {
    setIsEditing(false);
    // Aquí puedes implementar la lógica para guardar los cambios
    if (data.onSave) {
      data.onSave(nodeData);
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
      const text = nodeData.label;
      
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
          style={{ backgroundColor: nodeData.backgroundColor }}
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

          {/* Contenido editable */}
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
          <div className="flex items-center justify-end space-x-2 mt-3 pt-2 border-t border-gray-200">
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

  return (
    <div className={`relative ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-400 border-2 border-white"
      />
      <button
        onClick={(e) => {
          console.log('CustomNode clicked:', { id, data });
          // Llamar a la función onNodeClick si existe, sino usar onClick por defecto
          if (data.onNodeClick) {
            console.log('Calling onNodeClick with id:', id);
            data.onNodeClick(id);
          } else if (onClick) {
            onClick(e);
          }
        }}
        onDoubleClick={handleDoubleClick}
        type="button"
        className={`
          node-button rounded-lg shadow-md p-2 sm:p-3
          min-w-[140px] sm:min-w-[160px] md:min-w-[180px] max-w-[140px] sm:max-w-[160px] md:max-w-[180px] transition-all duration-200
          hover:shadow-lg hover:scale-105
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          cursor-pointer select-none
          ${selected ? 'shadow-lg' : ''}
        `}
        style={{ backgroundColor: nodeData.backgroundColor }}
      >
        <div className="flex flex-col items-center text-center">
          <span className="text-lg sm:text-xl md:text-2xl mb-1">{nodeData.icon}</span>
          <h3 
            className="font-semibold text-gray-900 text-xs sm:text-sm leading-tight mb-1"
            dangerouslySetInnerHTML={{ __html: renderFormattedText(nodeData.label) }}
          />
          <div className="text-xs text-blue-600 font-medium">
            Click para editar
          </div>
        </div>
      </button>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-400 border-2 border-white"
      />
    </div>
  );
};

export default CustomNode; 