import React from 'react';

const PropertiesPanel = ({ 
  showPropertiesPanel, 
  selectedNode, 
  onClose, 
  onUpdateNode, 
  propertiesTab, 
  onTabChange 
}) => {
  if (!showPropertiesPanel || !selectedNode) return null;

  const renderNodeTypeSpecificProperties = () => {
    const nodeType = selectedNode.data.nodeType || selectedNode.data.type;
    
    switch (nodeType) {
      case 'title':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase text-gray-400 mb-2">Label</label>
              <input
                type="text"
                value={selectedNode.data.label}
                onChange={(e) => onUpdateNode(selectedNode.id, 'label', e.target.value)}
                placeholder="Enter label"
                className="w-full h-8 px-2 py-3 text-sm border border-gray-200 rounded-sm focus:ring-1 focus:ring-black focus:outline-none"
              />
            </div>
          </div>
        );

      case 'topic':
      case 'subtopic':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase text-gray-400 mb-2">Label</label>
              <input
                type="text"
                value={selectedNode.data.label}
                onChange={(e) => onUpdateNode(selectedNode.id, 'label', e.target.value)}
                placeholder="Enter label"
                className="w-full h-8 px-2 py-3 text-sm border border-gray-200 rounded-sm focus:ring-1 focus:ring-black focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase text-gray-400 mb-2">Type</label>
              <select
                value={selectedNode.data.nodeType || 'topic'}
                onChange={(e) => onUpdateNode(selectedNode.id, 'nodeType', e.target.value)}
                className="w-full h-8 px-2 py-3 text-sm border border-gray-200 rounded-sm focus:ring-1 focus:ring-black focus:outline-none"
              >
                <option value="topic">Topic</option>
                <option value="subtopic">Subtopic</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase text-gray-400 mb-2">Description</label>
              <textarea
                value={selectedNode.data.description}
                onChange={(e) => onUpdateNode(selectedNode.id, 'description', e.target.value)}
                rows={3}
                placeholder="Enter description"
                className="w-full px-2 py-3 text-sm border border-gray-200 rounded-sm focus:ring-1 focus:ring-black focus:outline-none"
              />
            </div>
          </div>
        );

      case 'paragraph':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase text-gray-400 mb-2">Content</label>
              <textarea
                value={selectedNode.data.label}
                onChange={(e) => onUpdateNode(selectedNode.id, 'label', e.target.value)}
                rows={6}
                placeholder="Enter paragraph content..."
                className="w-full px-2 py-3 text-sm border border-gray-200 rounded-sm focus:ring-1 focus:ring-black focus:outline-none"
              />
            </div>
          </div>
        );

      case 'button':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase text-gray-400 mb-2">Button Text</label>
              <input
                type="text"
                value={selectedNode.data.label}
                onChange={(e) => onUpdateNode(selectedNode.id, 'label', e.target.value)}
                placeholder="Enter button text"
                className="w-full h-8 px-2 py-3 text-sm border border-gray-200 rounded-sm focus:ring-1 focus:ring-black focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase text-gray-400 mb-2">URL</label>
              <input
                type="url"
                value={selectedNode.data.url || ''}
                onChange={(e) => onUpdateNode(selectedNode.id, 'url', e.target.value)}
                placeholder="https://example.com"
                className="w-full h-8 px-2 py-3 text-sm border border-gray-200 rounded-sm focus:ring-1 focus:ring-black focus:outline-none"
              />
            </div>
          </div>
        );

      case 'todo':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase text-gray-400 mb-2">Task</label>
              <input
                type="text"
                value={selectedNode.data.label}
                onChange={(e) => onUpdateNode(selectedNode.id, 'label', e.target.value)}
                placeholder="Enter task"
                className="w-full h-8 px-2 py-3 text-sm border border-gray-200 rounded-sm focus:ring-1 focus:ring-black focus:outline-none"
              />
            </div>
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedNode.data.completed || false}
                  onChange={(e) => onUpdateNode(selectedNode.id, 'completed', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs uppercase text-gray-400">Completed</span>
              </label>
            </div>
          </div>
        );

      case 'checklist':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase text-gray-400 mb-2">List Title</label>
              <input
                type="text"
                value={selectedNode.data.label}
                onChange={(e) => onUpdateNode(selectedNode.id, 'label', e.target.value)}
                placeholder="Enter list title"
                className="w-full h-8 px-2 py-3 text-sm border border-gray-200 rounded-sm focus:ring-1 focus:ring-black focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase text-gray-400 mb-2">Items (one per line)</label>
              <textarea
                value={(selectedNode.data.items || []).join('\n')}
                onChange={(e) => onUpdateNode(selectedNode.id, 'items', e.target.value.split('\n').filter(item => item.trim()))}
                rows={6}
                placeholder="Item 1&#10;Item 2&#10;Item 3"
                className="w-full px-2 py-3 text-sm border border-gray-200 rounded-sm focus:ring-1 focus:ring-black focus:outline-none"
              />
            </div>
          </div>
        );

      case 'links-group':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase text-gray-400 mb-2">Group Title</label>
              <input
                type="text"
                value={selectedNode.data.label}
                onChange={(e) => onUpdateNode(selectedNode.id, 'label', e.target.value)}
                placeholder="Enter group title"
                className="w-full h-8 px-2 py-3 text-sm border border-gray-200 rounded-sm focus:ring-1 focus:ring-black focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase text-gray-400 mb-2">Links (one per line)</label>
              <textarea
                value={(selectedNode.data.links || []).join('\n')}
                onChange={(e) => onUpdateNode(selectedNode.id, 'links', e.target.value.split('\n').filter(link => link.trim()))}
                rows={6}
                placeholder="https://example1.com&#10;https://example2.com"
                className="w-full px-2 py-3 text-sm border border-gray-200 rounded-sm focus:ring-1 focus:ring-black focus:outline-none"
              />
            </div>
          </div>
        );

      case 'resource-button':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase text-gray-400 mb-2">Resource Name</label>
              <input
                type="text"
                value={selectedNode.data.label}
                onChange={(e) => onUpdateNode(selectedNode.id, 'label', e.target.value)}
                placeholder="Enter resource name"
                className="w-full h-8 px-2 py-3 text-sm border border-gray-200 rounded-sm focus:ring-1 focus:ring-black focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase text-gray-400 mb-2">Resource URL</label>
              <input
                type="url"
                value={selectedNode.data.url || ''}
                onChange={(e) => onUpdateNode(selectedNode.id, 'url', e.target.value)}
                placeholder="https://example.com"
                className="w-full h-8 px-2 py-3 text-sm border border-gray-200 rounded-sm focus:ring-1 focus:ring-black focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase text-gray-400 mb-2">Resource Type</label>
              <select
                value={selectedNode.data.resourceType || 'link'}
                onChange={(e) => onUpdateNode(selectedNode.id, 'resourceType', e.target.value)}
                className="w-full h-8 px-2 py-3 text-sm border border-gray-200 rounded-sm focus:ring-1 focus:ring-black focus:outline-none"
              >
                <option value="link">Link</option>
                <option value="video">Video</option>
                <option value="document">Document</option>
                <option value="tool">Tool</option>
              </select>
            </div>
          </div>
        );

      case 'horizontal-line':
      case 'vertical-line':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase text-gray-400 mb-2">Line Style</label>
              <select
                value={selectedNode.data.lineStyle || 'solid'}
                onChange={(e) => onUpdateNode(selectedNode.id, 'lineStyle', e.target.value)}
                className="w-full h-8 px-2 py-3 text-sm border border-gray-200 rounded-sm focus:ring-1 focus:ring-black focus:outline-none"
              >
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase text-gray-400 mb-2">Line Width</label>
              <input
                type="range"
                min="1"
                max="10"
                value={selectedNode.data.lineWidth || 2}
                onChange={(e) => onUpdateNode(selectedNode.id, 'lineWidth', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase text-gray-400 mb-2">Label</label>
              <input
                type="text"
                value={selectedNode.data.label}
                onChange={(e) => onUpdateNode(selectedNode.id, 'label', e.target.value)}
                placeholder="Enter label"
                className="w-full h-8 px-2 py-3 text-sm border border-gray-200 rounded-sm focus:ring-1 focus:ring-black focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase text-gray-400 mb-2">Description</label>
              <textarea
                value={selectedNode.data.description}
                onChange={(e) => onUpdateNode(selectedNode.id, 'description', e.target.value)}
                rows={3}
                placeholder="Enter description"
                className="w-full px-2 py-3 text-sm border border-gray-200 rounded-sm focus:ring-1 focus:ring-black focus:outline-none"
              />
            </div>
          </div>
        );
    }
  };

  const handleFontSizeChange = (size) => {
    const fontSizeMap = {
      'S': '12px',
      'M': '14px', 
      'L': '16px',
      'XL': '18px',
      'XXL': '24px'
    };
    onUpdateNode(selectedNode.id, 'fontSize', fontSizeMap[size]);
  };

  const getCurrentFontSize = () => {
    const fontSize = selectedNode.data.fontSize || '16px';
    const sizeMap = {
      '12px': 'S',
      '14px': 'M',
      '16px': 'L', 
      '18px': 'XL',
      '24px': 'XXL'
    };
    return sizeMap[fontSize] || 'L';
  };

  return (
    <div className="fixed right-0 top-20 w-96 h-[calc(100vh-5rem)] bg-white border-l border-gray-100 z-40 flex flex-col shadow-none">
      {/* Header minimalista */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <span className="font-medium text-gray-700 text-base">Editar Nodo</span>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
          title="Cerrar panel"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Contenido de propiedades */}
      <div className="flex-1 overflow-y-auto p-4 bg-white">
        <div className="flex flex-col">
          {/* Propiedades específicas del tipo de nodo */}
          {renderNodeTypeSpecificProperties()}



          <hr className="my-5 border-gray-200" />

          {/* Controles de tamaño de fuente */}
          <div>
            <h3 className="text-xs uppercase text-gray-400">Tamaño de Fuente</h3>
            <div className="mt-2 flex gap-2">
              {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                <button
                  key={size}
                  onClick={() => handleFontSizeChange(size)}
                  className={`flex h-6 w-6 min-w-max items-center justify-center rounded-md px-1 text-sm font-medium hover:bg-gray-200/80 disabled:cursor-not-allowed disabled:text-gray-600 disabled:opacity-60 ${
                    getCurrentFontSize() === size ? 'bg-blue-500 text-white' : 'bg-gray-200'
                  }`}
                >
                  <span className="text-xs font-medium">{size}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Control de color del nodo - solo para tema y subtema */}
          {(selectedNode.data.nodeType === 'topic' || selectedNode.data.nodeType === 'subtopic') && (
            <>
              <hr className="my-5 border-gray-200" />
              <div>
                <h3 className="text-xs uppercase text-gray-400">Color del Nodo</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {[
                    { label: 'a', color: '#333333', borderColor: '#333333', textColor: '#ffffff' },
                    { label: 'b', color: '#fdff00', borderColor: '#d6d700', textColor: '#000000' },
                    { label: 'c', color: '#ffe599', borderColor: '#f3c950', textColor: '#000000' },
                    { label: 'd', color: '#c6f6d5', borderColor: '#c6f6d5', textColor: '#000000' },
                    { label: 'e', color: '#a8caff', borderColor: '#74adff', textColor: '#000000' },
                    { label: 'f', color: '#cbcbcb', borderColor: '#aaaaaa', textColor: '#000000' },
                    { label: 'g', color: '#fed7e2', borderColor: '#fdcaa9', textColor: '#000000' },
                    { label: 'h', color: '#f4f4f4', borderColor: '#cccccc', textColor: '#000000' }
                  ].map((colorOption) => (
                    <button
                      key={colorOption.label}
                      aria-label={colorOption.label}
                      onClick={() => onUpdateNode(selectedNode.id, 'backgroundColor', colorOption.color)}
                      className={`flex h-6 w-6 min-w-max shrink-0 items-center justify-center rounded-md border px-1 text-sm font-medium uppercase ${
                        selectedNode.data.backgroundColor === colorOption.color ? 'ring-2 ring-blue-500' : ''
                      }`}
                      style={{
                        backgroundColor: colorOption.color,
                        color: colorOption.textColor,
                        borderColor: colorOption.borderColor
                      }}
                    >
                      {colorOption.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Paragraph Style - solo para nodos de tipo paragraph */}
          {selectedNode.data.nodeType === 'paragraph' && (
            <>
              <hr className="my-5 border-gray-200" />
              <div>
                <h3 className="text-xs uppercase text-gray-400">Estilo de Párrafo</h3>
                <div className="mt-3 space-y-4">
                  <div className="flex items-center justify-between">
                                          <label className="text-sm font-medium tracking-tight">Fondo</label>
                    <div className="flex items-center gap-1.5">
                      <div className="relative">
                        <span 
                          className="block h-4 w-4 rounded-sm shadow-sm" 
                          style={{ backgroundColor: selectedNode.data.backgroundColor || 'transparent' }}
                        ></span>
                        <input
                          type="color"
                          value={selectedNode.data.backgroundColor || '#ffffff'}
                          onChange={(e) => onUpdateNode(selectedNode.id, 'backgroundColor', e.target.value)}
                          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        />
                      </div>
                      <input
                        type="text"
                        value={selectedNode.data.backgroundColor || 'TRANSPARENT'}
                        onChange={(e) => onUpdateNode(selectedNode.id, 'backgroundColor', e.target.value)}
                        className="w-16 text-sm tabular-nums focus:outline-none"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                                          <label className="text-sm font-medium tracking-tight">Borde</label>
                    <div className="flex items-center gap-1.5">
                      <div className="relative">
                        <span 
                          className="block h-4 w-4 rounded-sm shadow-sm" 
                          style={{ backgroundColor: selectedNode.data.borderColor || 'transparent' }}
                        ></span>
                        <input
                          type="color"
                          value={selectedNode.data.borderColor || '#ffffff'}
                          onChange={(e) => onUpdateNode(selectedNode.id, 'borderColor', e.target.value)}
                          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        />
                      </div>
                      <input
                        type="text"
                        value={selectedNode.data.borderColor || 'TRANSPARENT'}
                        onChange={(e) => onUpdateNode(selectedNode.id, 'borderColor', e.target.value)}
                        className="w-16 text-sm tabular-nums focus:outline-none"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                                          <label className="text-sm font-medium tracking-tight">Texto</label>
                    <div className="flex items-center gap-1.5">
                      <div className="relative">
                        <span 
                          className="block h-4 w-4 rounded-sm shadow-sm" 
                          style={{ backgroundColor: selectedNode.data.textColor || '#000000' }}
                        ></span>
                        <input
                          type="color"
                          value={selectedNode.data.textColor || '#000000'}
                          onChange={(e) => onUpdateNode(selectedNode.id, 'textColor', e.target.value)}
                          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        />
                      </div>
                      <input
                        type="text"
                        value={selectedNode.data.textColor || '#000000'}
                        onChange={(e) => onUpdateNode(selectedNode.id, 'textColor', e.target.value)}
                        className="w-16 text-sm tabular-nums focus:outline-none"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                                          <label className="text-sm font-medium tracking-tight">Relleno</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        value={selectedNode.data.padding || 16}
                        onChange={(e) => onUpdateNode(selectedNode.id, 'padding', parseInt(e.target.value))}
                        className="h-8 w-16 rounded-md border px-2 py-1 text-sm font-medium focus:outline-none"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium tracking-tight">Alineación de Texto</h3>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onUpdateNode(selectedNode.id, 'textAlign', 'left')}
                        className={`flex h-6 w-6 items-center justify-center rounded-md text-sm font-medium hover:bg-gray-200/80 disabled:cursor-not-allowed disabled:text-gray-600 disabled:opacity-60 ${
                          selectedNode.data.textAlign === 'left' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                        }`}
                      >
                        <svg className="h-4 w-4 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M15 12H3"></path>
                          <path d="M17 18H3"></path>
                          <path d="M21 6H3"></path>
                        </svg>
                      </button>
                      <button
                        onClick={() => onUpdateNode(selectedNode.id, 'textAlign', 'center')}
                        className={`flex h-6 w-6 items-center justify-center rounded-md text-sm font-medium hover:bg-gray-200/80 disabled:cursor-not-allowed disabled:text-gray-600 disabled:opacity-60 ${
                          selectedNode.data.textAlign === 'center' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                        }`}
                      >
                        <svg className="h-4 w-4 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M17 12H7"></path>
                          <path d="M19 18H5"></path>
                          <path d="M21 6H3"></path>
                        </svg>
                      </button>
                      <button
                        onClick={() => onUpdateNode(selectedNode.id, 'textAlign', 'right')}
                        className={`flex h-6 w-6 items-center justify-center rounded-md text-sm font-medium hover:bg-gray-200/80 disabled:cursor-not-allowed disabled:text-gray-600 disabled:opacity-60 ${
                          selectedNode.data.textAlign === 'right' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                        }`}
                      >
                        <svg className="h-4 w-4 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M21 12H9"></path>
                          <path d="M21 18H7"></path>
                          <path d="M21 6H3"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium tracking-tight">Justificación</h3>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onUpdateNode(selectedNode.id, 'justifyContent', 'start')}
                        className={`flex h-6 w-6 items-center justify-center rounded-md text-sm font-medium hover:bg-gray-200/80 disabled:cursor-not-allowed disabled:text-gray-600 disabled:opacity-60 ${
                          selectedNode.data.justifyContent === 'start' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                        }`}
                      >
                        <svg className="h-4 w-4 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <rect width="6" height="16" x="4" y="6" rx="2"></rect>
                          <rect width="6" height="9" x="14" y="6" rx="2"></rect>
                          <path d="M22 2H2"></path>
                        </svg>
                      </button>
                      <button
                        onClick={() => onUpdateNode(selectedNode.id, 'justifyContent', 'center')}
                        className={`flex h-6 w-6 items-center justify-center rounded-md text-sm font-medium hover:bg-gray-200/80 disabled:cursor-not-allowed disabled:text-gray-600 disabled:opacity-60 ${
                          selectedNode.data.justifyContent === 'center' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                        }`}
                      >
                        <svg className="h-4 w-4 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M2 12h20"></path>
                          <path d="M10 16v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4"></path>
                          <path d="M10 8V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v4"></path>
                          <path d="M20 16v1a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-1"></path>
                          <path d="M14 8V7c0-1.1.9-2 2-2h2a2 2 0 0 1 2 2v1"></path>
                        </svg>
                      </button>
                      <button
                        onClick={() => onUpdateNode(selectedNode.id, 'justifyContent', 'end')}
                        className={`flex h-6 w-6 items-center justify-center rounded-md text-sm font-medium hover:bg-gray-200/80 disabled:cursor-not-allowed disabled:text-gray-600 disabled:opacity-60 ${
                          selectedNode.data.justifyContent === 'end' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                        }`}
                      >
                        <svg className="h-4 w-4 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <rect width="6" height="16" x="4" y="2" rx="2"></rect>
                          <rect width="6" height="9" x="14" y="9" rx="2"></rect>
                          <path d="M22 22H2"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}


        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel; 