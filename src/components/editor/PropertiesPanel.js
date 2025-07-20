import React, { useState, useEffect } from 'react';

const PropertiesPanel = ({ 
  showPropertiesPanel, 
  selectedNode, 
  selectedEdge,
  onClose, 
  onUpdateNode, 
  onUpdateEdge,
  propertiesTab, 
  onTabChange 
}) => {
  if (!showPropertiesPanel || (!selectedNode && !selectedEdge)) {
    return null;
  }

  const nodeType = selectedNode?.data.nodeType || selectedNode?.data.type;
  const shouldShowTabs = selectedNode && ['topic', 'subtopic', 'todo'].includes(nodeType);

  // Estado local para manejar los enlaces
  const [links, setLinks] = useState([]);

  // Inicializar enlaces cuando cambia el nodo seleccionado
  useEffect(() => {
    if (selectedNode && selectedNode.data.links) {
      setLinks(selectedNode.data.links);
    } else {
      setLinks([]);
    }
  }, [selectedNode]);

  // Función para agregar un nuevo enlace
  const addLink = () => {
    const newLink = {
      id: Date.now().toString(),
      type: 'video',
      title: '',
      url: ''
    };
    const updatedLinks = [...links, newLink];
    setLinks(updatedLinks);
    onUpdateNode(selectedNode.id, 'links', updatedLinks);
  };

  // Función para eliminar un enlace
  const removeLink = (linkId) => {
    const updatedLinks = links.filter(link => link.id !== linkId);
    setLinks(updatedLinks);
    onUpdateNode(selectedNode.id, 'links', updatedLinks);
  };

  // Función para actualizar un enlace
  const updateLink = (linkId, field, value) => {
    const updatedLinks = links.map(link => 
      link.id === linkId ? { ...link, [field]: value } : link
    );
    setLinks(updatedLinks);
    onUpdateNode(selectedNode.id, 'links', updatedLinks);
  };

  // Renderizar propiedades de flechas (edges)
  const renderEdgeProperties = () => {
    if (!selectedEdge) return null;

    return (
      <div className="flex flex-col">
        <h3 className="text-xs uppercase text-gray-400 mt-4">Estilo de Flecha</h3>
        
        {/* Color de la flecha */}
        <div className="mt-2 flex items-center justify-between">
          <label htmlFor="edge-color" className="text-sm font-medium tracking-tight">Color</label>
          <div className="flex items-center gap-1.5">
            <div className="relative">
              <span 
                className="block h-4 w-4 rounded-sm shadow-sm" 
                style={{ backgroundColor: selectedEdge.style?.stroke || '#2B78E4' }}
              ></span>
              <input 
                id="edge-color" 
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0" 
                type="color" 
                value={selectedEdge.style?.stroke || '#2B78E4'}
                onChange={(e) => {
                  const newColor = e.target.value;
                  onUpdateEdge(selectedEdge.id, 'style', { 
                    ...selectedEdge.style, 
                    stroke: newColor 
                  });
                  // Actualizar también el color de la flecha
                  onUpdateEdge(selectedEdge.id, 'markerEnd', { 
                    ...selectedEdge.markerEnd, 
                    color: newColor 
                  });
                }}
              />
            </div>
            <input 
              className="focus:outline-hidden w-16 text-sm tabular-nums focus:border-none" 
              type="text" 
              value={selectedEdge.style?.stroke || '#2B78E4'}
              onChange={(e) => {
                const newColor = e.target.value;
                onUpdateEdge(selectedEdge.id, 'style', { 
                  ...selectedEdge.style, 
                  stroke: newColor 
                });
                // Actualizar también el color de la flecha
                onUpdateEdge(selectedEdge.id, 'markerEnd', { 
                  ...selectedEdge.markerEnd, 
                  color: newColor 
                });
              }}
            />
          </div>
        </div>

        {/* Estilo de línea */}
        <div className="mt-4 flex items-center justify-between">
          <h3 className="text-sm font-medium tracking-tight">Estilo de Línea</h3>
          <div className="flex items-center gap-1.5">
            <button 
              className={`flex h-6 w-6 items-center justify-center rounded-md text-sm font-medium hover:bg-gray-200/80 disabled:cursor-not-allowed disabled:text-gray-600 disabled:opacity-60 ${
                selectedEdge.type === 'straight' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
              onClick={() => {
                onUpdateEdge(selectedEdge.id, 'type', 'straight');
                onUpdateEdge(selectedEdge.id, 'data', { 
                  ...selectedEdge.data, 
                  lineStyle: 'straight' 
                });
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-3 w-3">
                <path d="M1 8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </button>
            <button 
              className={`flex h-6 w-6 items-center justify-center rounded-md text-sm font-medium hover:bg-gray-200/80 disabled:cursor-not-allowed disabled:text-gray-600 disabled:opacity-60 ${
                selectedEdge.type === 'angle' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
              onClick={() => {
                onUpdateEdge(selectedEdge.id, 'type', 'angle');
                onUpdateEdge(selectedEdge.id, 'data', { 
                  ...selectedEdge.data, 
                  lineStyle: 'angle' 
                });
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-3 w-3">
                <path d="M1 8H8L8 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </button>
            <button 
              className={`flex h-6 w-6 items-center justify-center rounded-md text-sm font-medium hover:bg-gray-200/80 disabled:cursor-not-allowed disabled:text-gray-600 disabled:opacity-60 ${
                selectedEdge.type === 'curved' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
              onClick={() => {
                onUpdateEdge(selectedEdge.id, 'type', 'curved');
                onUpdateEdge(selectedEdge.id, 'data', { 
                  ...selectedEdge.data, 
                  lineStyle: 'curved' 
                });
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-3 w-3">
                <path d="M1 8C4 8 8 4 8 8C8 12 12 8 15 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Grosor de la línea */}
        <div className="mt-4 flex items-center justify-between">
          <h3 className="text-sm font-medium tracking-tight">Grosor</h3>
          <div className="flex items-center gap-1.5">
            <button 
              disabled={selectedEdge.style?.strokeWidth <= 1}
              className="flex h-6 w-6 items-center justify-center rounded-md bg-gray-200 text-sm font-medium hover:bg-gray-200/80 disabled:cursor-not-allowed disabled:text-gray-600 disabled:opacity-60"
              onClick={() => onUpdateEdge(selectedEdge.id, 'style', { 
                ...selectedEdge.style, 
                strokeWidth: Math.max(1, (selectedEdge.style?.strokeWidth || 3) - 1) 
              })}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 stroke-2">
                <path d="M5 12h14"></path>
              </svg>
            </button>
            <button 
              className="flex h-6 w-6 items-center justify-center rounded-md bg-gray-200 text-sm font-medium hover:bg-gray-200/80 disabled:cursor-not-allowed disabled:text-gray-600 disabled:opacity-60"
              onClick={() => onUpdateEdge(selectedEdge.id, 'style', { 
                ...selectedEdge.style, 
                strokeWidth: (selectedEdge.style?.strokeWidth || 3) + 1 
              })}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 stroke-2">
                <path d="M12 5v14"></path>
                <path d="M5 12h14"></path>
                <path d="M12 5v14"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Tipo de línea */}
        <div className="mt-4 flex items-center justify-between">
          <h3 className="text-sm font-medium tracking-tight">Tipo de Línea</h3>
          <div className="flex items-center gap-1.5">
            <button 
              className={`flex h-6 w-6 items-center justify-center rounded-md text-sm font-medium hover:bg-gray-200/80 disabled:cursor-not-allowed disabled:text-gray-600 disabled:opacity-60 ${
                !selectedEdge.style?.strokeDasharray ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
              onClick={() => onUpdateEdge(selectedEdge.id, 'style', { 
                ...selectedEdge.style, 
                strokeDasharray: undefined 
              })}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-3 w-3">
                <path d="M1 8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </button>
            <button 
              className={`flex h-6 w-6 items-center justify-center rounded-md text-sm font-medium hover:bg-gray-200/80 disabled:cursor-not-allowed disabled:text-gray-600 disabled:opacity-60 ${
                selectedEdge.style?.strokeDasharray === '3,3' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
              onClick={() => onUpdateEdge(selectedEdge.id, 'style', { 
                ...selectedEdge.style, 
                strokeDasharray: '3,3' 
              })}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-3 w-3">
                <path d="M1 8H3M5 8H7M9 8H11M13 8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </button>
            <button 
              className={`flex h-6 w-6 items-center justify-center rounded-md text-sm font-medium hover:bg-gray-200/80 disabled:cursor-not-allowed disabled:text-gray-600 disabled:opacity-60 ${
                selectedEdge.style?.strokeDasharray === '6,6' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
              onClick={() => onUpdateEdge(selectedEdge.id, 'style', { 
                ...selectedEdge.style, 
                strokeDasharray: '6,6' 
              })}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-3 w-3">
                <path d="M1 8H2M4 8H5M7 8H8M10 8H11M13 8H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Estilo de la flecha */}
        <div className="mt-4 flex items-center justify-between">
          <h3 className="text-sm font-medium tracking-tight">Estilo de Flecha</h3>
          <div className="flex items-center gap-1.5">
            <button 
              className={`flex h-6 w-6 items-center justify-center rounded-md text-sm font-medium hover:bg-gray-200/80 disabled:cursor-not-allowed disabled:text-gray-600 disabled:opacity-60 ${
                selectedEdge.markerEnd?.type === 'arrow' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
              onClick={() => onUpdateEdge(selectedEdge.id, 'markerEnd', { type: 'arrow' })}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 stroke-2">
                <path d="m12 19-7-7 7-7"></path>
                <path d="M19 12H5"></path>
              </svg>
            </button>
            <button 
              className={`flex h-6 w-6 items-center justify-center rounded-md text-sm font-medium hover:bg-gray-200/80 disabled:cursor-not-allowed disabled:text-gray-600 disabled:opacity-60 ${
                selectedEdge.markerEnd?.type === 'arrowclosed' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
              onClick={() => onUpdateEdge(selectedEdge.id, 'markerEnd', { type: 'arrowclosed' })}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 fill-black">
                <path d="M18 15h-6v4l-7-7 7-7v4h6v6z"></path>
              </svg>
            </button>
          </div>
        </div>


      </div>
    );
  };

  const renderPropertiesTab = () => {
    switch (nodeType) {
      case 'title':
        return (
          <div className="flex flex-col mt-4">
            <div className="flex flex-col">
              <label className="text-xs uppercase text-gray-400">Etiqueta</label>
              <input
                type="text"
                value={selectedNode.data.label}
                onChange={(e) => onUpdateNode(selectedNode.id, 'label', e.target.value)}
                placeholder="Ingresar etiqueta"
                className="focus:outline-hidden mt-2 flex h-8 items-center rounded-sm border border-gray-200 px-2 py-3 text-sm focus:ring-1 focus:ring-black"
              />
            </div>
          </div>
        );

      case 'topic':
      case 'subtopic':
        return (
          <div className="flex flex-col">
            <div className="flex flex-col">
              <label className="text-xs uppercase text-gray-400">Etiqueta</label>
              <input
                type="text"
                value={selectedNode.data.label}
                onChange={(e) => onUpdateNode(selectedNode.id, 'label', e.target.value)}
                placeholder="Ingresar etiqueta"
                className="focus:outline-hidden mt-2 flex h-8 items-center rounded-sm border border-gray-200 px-2 py-3 text-sm focus:ring-1 focus:ring-black"
              />
            </div>
            <div className="mt-4 flex flex-col">
              <label className="text-xs uppercase text-gray-400">Tipo</label>
              <div className="w-full">
                <select
                  value={selectedNode.data.nodeType || 'topic'}
                  onChange={(e) => onUpdateNode(selectedNode.id, 'nodeType', e.target.value)}
                  className="focus:outline-hidden mt-2 flex h-8 w-full items-center rounded-sm border border-gray-200 px-4 text-sm focus:ring-1 focus:ring-black"
                  style={{ minWidth: '100%', textOverflow: 'unset', width: '100%', paddingTop: '0.3rem', paddingBottom: '0.3rem' }}
                >
                  <option value="topic" style={{ width: '100%' }}>Tema</option>
                  <option value="subtopic" style={{ width: '100%' }}>Subtema</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex flex-col">
              <label className="text-xs uppercase text-gray-400">Descripción</label>
              <textarea
                value={selectedNode.data.description}
                onChange={(e) => onUpdateNode(selectedNode.id, 'description', e.target.value)}
                rows={3}
                placeholder="Ingresar descripción"
                className="focus:outline-hidden mt-2 flex items-center rounded-sm border border-gray-200 px-2 py-3 text-sm focus:ring-1 focus:ring-black"
              />
            </div>
          </div>
        );

      case 'todo':
        return (
          <div className="flex flex-col">
            <div className="flex flex-col">
              <label className="text-xs uppercase text-gray-400">Tarea</label>
              <input
                type="text"
                value={selectedNode.data.label}
                onChange={(e) => onUpdateNode(selectedNode.id, 'label', e.target.value)}
                placeholder="Ingresar tarea"
                className="focus:outline-hidden mt-2 flex h-8 items-center rounded-sm border border-gray-200 px-2 py-3 text-sm focus:ring-1 focus:ring-black"
              />
            </div>
            <div className="mt-4 flex flex-col">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedNode.data.completed || false}
                  onChange={(e) => onUpdateNode(selectedNode.id, 'completed', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs uppercase text-gray-400">Completada</span>
              </label>
            </div>
          </div>
        );

      case 'paragraph':
        return (
          <div className="flex flex-col mt-4">
            <div className="flex flex-col">
              <label className="text-xs uppercase text-gray-400">Contenido</label>
              <textarea
                value={selectedNode.data.label}
                onChange={(e) => onUpdateNode(selectedNode.id, 'label', e.target.value)}
                rows={6}
                placeholder="Ingresar contenido del párrafo..."
                className="focus:outline-hidden mt-2 flex items-center rounded-sm border border-gray-200 px-2 py-3 text-sm focus:ring-1 focus:ring-black"
              />
            </div>
          </div>
        );

      case 'button':
        return (
          <div className="flex flex-col">
            <div className="flex flex-col">
              <label className="text-xs uppercase text-gray-400">Texto del Botón</label>
              <input
                type="text"
                value={selectedNode.data.label}
                onChange={(e) => onUpdateNode(selectedNode.id, 'label', e.target.value)}
                placeholder="Ingresar texto del botón"
                className="focus:outline-hidden mt-2 flex h-8 items-center rounded-sm border border-gray-200 px-2 py-3 text-sm focus:ring-1 focus:ring-black"
              />
            </div>
            <div className="mt-4 flex flex-col">
              <label className="text-xs uppercase text-gray-400">URL</label>
              <input
                type="url"
                value={selectedNode.data.url || ''}
                onChange={(e) => onUpdateNode(selectedNode.id, 'url', e.target.value)}
                placeholder="https://ejemplo.com"
                className="focus:outline-hidden mt-2 flex h-8 items-center rounded-sm border border-gray-200 px-2 py-3 text-sm focus:ring-1 focus:ring-black"
              />
            </div>
          </div>
        );

      case 'checklist':
        return (
          <div className="flex flex-col">
            <div className="flex flex-col">
              <label className="text-xs uppercase text-gray-400">Título de la Lista</label>
              <input
                type="text"
                value={selectedNode.data.label}
                onChange={(e) => onUpdateNode(selectedNode.id, 'label', e.target.value)}
                placeholder="Ingresar título de la lista"
                className="focus:outline-hidden mt-2 flex h-8 items-center rounded-sm border border-gray-200 px-2 py-3 text-sm focus:ring-1 focus:ring-black"
              />
            </div>
            <div className="mt-4 flex flex-col">
              <label className="text-xs uppercase text-gray-400">Elementos (uno por línea)</label>
              <textarea
                value={(selectedNode.data.items || []).join('\n')}
                onChange={(e) => onUpdateNode(selectedNode.id, 'items', e.target.value.split('\n').filter(item => item.trim()))}
                rows={6}
                placeholder="Elemento 1&#10;Elemento 2&#10;Elemento 3"
                className="focus:outline-hidden mt-2 flex items-center rounded-sm border border-gray-200 px-2 py-3 text-sm focus:ring-1 focus:ring-black"
              />
            </div>
          </div>
        );

      case 'links-group':
        return (
          <div className="flex flex-col">
            <div className="flex flex-col">
              <label className="text-xs uppercase text-gray-400">Título del Grupo</label>
              <input
                type="text"
                value={selectedNode.data.label}
                onChange={(e) => onUpdateNode(selectedNode.id, 'label', e.target.value)}
                placeholder="Ingresar título del grupo"
                className="focus:outline-hidden mt-2 flex h-8 items-center rounded-sm border border-gray-200 px-2 py-3 text-sm focus:ring-1 focus:ring-black"
              />
            </div>
            <div className="mt-4 flex flex-col">
              <label className="text-xs uppercase text-gray-400">Enlaces (uno por línea)</label>
              <textarea
                value={(selectedNode.data.links || []).join('\n')}
                onChange={(e) => onUpdateNode(selectedNode.id, 'links', e.target.value.split('\n').filter(link => link.trim()))}
                rows={6}
                placeholder="https://ejemplo1.com&#10;https://ejemplo2.com"
                className="focus:outline-hidden mt-2 flex items-center rounded-sm border border-gray-200 px-2 py-3 text-sm focus:ring-1 focus:ring-black"
              />
            </div>
          </div>
        );

      case 'resource-button':
        return (
          <div className="flex flex-col">
            <div className="flex flex-col">
              <label className="text-xs uppercase text-gray-400">Nombre del Recurso</label>
              <input
                type="text"
                value={selectedNode.data.label}
                onChange={(e) => onUpdateNode(selectedNode.id, 'label', e.target.value)}
                placeholder="Ingresar nombre del recurso"
                className="focus:outline-hidden mt-2 flex h-8 items-center rounded-sm border border-gray-200 px-2 py-3 text-sm focus:ring-1 focus:ring-black"
              />
            </div>
            <div className="mt-4 flex flex-col">
              <label className="text-xs uppercase text-gray-400">URL del Recurso</label>
              <input
                type="url"
                value={selectedNode.data.url || ''}
                onChange={(e) => onUpdateNode(selectedNode.id, 'url', e.target.value)}
                placeholder="https://ejemplo.com"
                className="focus:outline-hidden mt-2 flex h-8 items-center rounded-sm border border-gray-200 px-2 py-3 text-sm focus:ring-1 focus:ring-black"
              />
            </div>
            <div className="mt-4 flex flex-col">
              <label className="text-xs uppercase text-gray-400">Tipo de Recurso</label>
              <select
                value={selectedNode.data.resourceType || 'link'}
                onChange={(e) => onUpdateNode(selectedNode.id, 'resourceType', e.target.value)}
                className="focus:outline-hidden mt-2 flex h-8 w-full items-center rounded-sm border border-gray-200 px-4 text-sm focus:ring-1 focus:ring-black"
                style={{ paddingTop: '0.3rem', paddingBottom: '0.3rem' }}
              >
                <option value="link">Enlace</option>
                <option value="video">Video</option>
                <option value="document">Documento</option>
                <option value="tool">Herramienta</option>
              </select>
            </div>
          </div>
        );

      case 'horizontal-line':
      case 'vertical-line':
        return (
          <div className="flex flex-col">
            <div className="mt-4 flex flex-col">
              <label className="text-xs uppercase text-gray-400">Grosor de Línea</label>
              <div className="mt-2 flex gap-2">
                {[1, 2, 3, 4, 5, 6, 8, 10].map((width) => (
                  <button
                    key={width}
                    onClick={() => onUpdateNode(selectedNode.id, 'lineWidth', width)}
                    className={`flex h-6 w-6 min-w-max items-center justify-center rounded-md px-1 text-sm font-medium hover:bg-gray-200/80 disabled:cursor-not-allowed disabled:text-gray-600 disabled:opacity-60 ${
                      (selectedNode.data.lineWidth || 2) === width ? 'bg-blue-500 text-white' : 'bg-gray-200'
                    }`}
                  >
                    <span className="text-xs font-medium">{width}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4 flex flex-col">
              <label className="text-xs uppercase text-gray-400">Color de Línea</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {[
                  { label: 'G', color: '#6B7280', name: 'Gris' },
                  { label: 'N', color: '#000000', name: 'Negro' },
                  { label: 'A', color: '#3B82F6', name: 'Azul' },
                  { label: 'V', color: '#10B981', name: 'Verde' },
                  { label: 'R', color: '#EF4444', name: 'Rojo' },
                  { label: 'M', color: '#8B5CF6', name: 'Morado' },
                  { label: 'C', color: '#F59E0B', name: 'Naranja' }
                ].map((colorOption) => (
                  <button
                    key={colorOption.label}
                    aria-label={colorOption.name}
                    onClick={() => onUpdateNode(selectedNode.id, 'lineColor', colorOption.color)}
                    className={`flex h-6 w-6 min-w-max shrink-0 items-center justify-center rounded-md border px-1 text-sm font-medium uppercase ${
                      (selectedNode.data.lineColor || '#6B7280') === colorOption.color ? 'ring-2 ring-blue-500' : ''
                    }`}
                    style={{
                      backgroundColor: colorOption.color,
                      color: colorOption.color === '#000000' ? '#ffffff' : '#ffffff',
                      borderColor: colorOption.color
                    }}
                  >
                    {colorOption.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4 flex flex-col">
              <label className="text-xs uppercase text-gray-400">Estilo de Línea</label>
              <select
                value={selectedNode.data.lineStyle || 'solid'}
                onChange={(e) => onUpdateNode(selectedNode.id, 'lineStyle', e.target.value)}
                className="focus:outline-hidden mt-2 flex h-8 w-full items-center rounded-sm border border-gray-200 px-4 text-sm focus:ring-1 focus:ring-black"
                style={{ paddingTop: '0.3rem', paddingBottom: '0.3rem' }}
              >
                <option value="solid">Sólida</option>
                <option value="dashed">Discontinua</option>
                <option value="dotted">Punteada</option>
              </select>
            </div>
            <div className="mt-4 flex flex-col">
              <label className="text-xs uppercase text-gray-400">Tamaño de Línea</label>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={selectedNode.data.lineSize || 100}
                  onChange={(e) => onUpdateNode(selectedNode.id, 'lineSize', parseInt(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm text-gray-600 min-w-[3rem] text-right">
                  {selectedNode.data.lineSize || 100}
                </span>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col">
            <div className="flex flex-col">
              <label className="text-xs uppercase text-gray-400">Label</label>
              <input
                type="text"
                value={selectedNode.data.label}
                onChange={(e) => onUpdateNode(selectedNode.id, 'label', e.target.value)}
                placeholder="Enter label"
                className="focus:outline-hidden mt-2 flex h-8 items-center rounded-sm border border-gray-200 px-2 py-3 text-sm focus:ring-1 focus:ring-black"
              />
            </div>
            <div className="mt-4 flex flex-col">
              <label className="text-xs uppercase text-gray-400">Description</label>
              <textarea
                value={selectedNode.data.description}
                onChange={(e) => onUpdateNode(selectedNode.id, 'description', e.target.value)}
                rows={3}
                placeholder="Enter description"
                className="focus:outline-hidden mt-2 flex items-center rounded-sm border border-gray-200 px-2 py-3 text-sm focus:ring-1 focus:ring-black"
              />
            </div>
          </div>
        );
    }
  };

  const renderContentAndLinksTab = () => {
    return (
      <div className="flex flex-col">
        <div className="flex flex-col">
          <label htmlFor="title" className="text-xs uppercase text-gray-400">Título</label>
          <input 
            id="title" 
            placeholder="Ingresar título" 
            className="focus:outline-hidden mt-2 flex h-8 items-center rounded-sm border border-gray-200 px-2 py-3 text-sm focus:ring-1 focus:ring-black" 
            type="text" 
            value={selectedNode.data.label || ''} 
            name="title"
            onChange={(e) => onUpdateNode(selectedNode.id, 'label', e.target.value)}
          />
        </div>
        <div className="mt-4 flex flex-col">
          <label htmlFor="description" className="flex items-center text-xs uppercase text-gray-400">
            Descripción
            <button data-state="closed">
              <span className="group relative normal-case">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-info ml-1 inline-block">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 16v-4"></path>
                  <path d="M12 8h.01"></path>
                </svg>
              </span>
            </button>
          </label>
          <div className="relative">
            <div 
              contentEditable="true" 
              translate="no" 
              className="tiptap ProseMirror content-editor prose prose-quoteless prose-h1:mb-2.5 prose-h1:mt-7 prose-h2:mb-3 prose-h2:mt-0 prose-h3:mb-[5px] prose-h3:mt-[10px] prose-p:mb-2 prose-p:mt-0 prose-blockquote:font-normal prose-blockquote:not-italic prose-blockquote:text-gray-700 prose-li:m-0 prose-li:mb-0.5 mt-2 min-h-[300px] border border-gray-200 rounded-sm p-2 focus:outline-hidden focus:ring-1 focus:ring-black" 
              tabIndex="0"
              dangerouslySetInnerHTML={{ __html: selectedNode.data.description || '<p><br class="ProseMirror-trailingBreak"></p>' }}
              onBlur={(e) => onUpdateNode(selectedNode.id, 'description', e.target.innerHTML)}
            >
            </div>
          </div>
        </div>
        <div className="mt-4 space-y-2 border-t border-gray-200 pt-4">
          {links.map((link, index) => (
            <div key={link.id} className="flex flex-col gap-1 overflow-hidden rounded-md border border-gray-200">
              <div className="flex flex-col gap-2 p-3">
                <select 
                  className="focus-visible:outline-hidden flex h-8 rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm transition-colors placeholder:text-gray-600 focus-visible:ring-1 focus-visible:ring-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
                  value={link.type}
                  onChange={(e) => updateLink(link.id, 'type', e.target.value)}
                >
                  <option value="video">Video</option>
                  <option value="article">Artículo</option>
                  <option value="opensource">Código Abierto</option>
                  <option value="course">Curso</option>
                  <option value="website">Sitio Web</option>
                  <option value="podcast">Podcast</option>
                </select>
                <div className="relative flex grow flex-col gap-1.5">
                  <input 
                    id={`link-title-${link.id}`}
                    placeholder="Título del recurso" 
                    className="focus-visible:outline-hidden flex h-8 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 pl-7 text-sm transition-colors placeholder:text-gray-600 focus-visible:ring-1 focus-visible:ring-gray-500 disabled:cursor-not-allowed disabled:opacity-50" 
                    type="text" 
                    value={link.title}
                    onChange={(e) => updateLink(link.id, 'title', e.target.value)}
                  />
                  <label htmlFor={`link-title-${link.id}`} className="absolute left-[8px] top-[9px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-check h-[14px] w-[14px]">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="m9 12 2 2 4-4"></path>
                    </svg>
                  </label>
                </div>
                <div className="relative flex grow flex-col gap-1.5">
                  <input 
                    id={`link-url-${link.id}`}
                    spellCheck="false" 
                    placeholder="URL del recurso" 
                    className="focus-visible:outline-hidden flex h-8 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 pl-7 text-sm transition-colors placeholder:text-gray-600 focus-visible:ring-1 focus-visible:ring-gray-500 disabled:cursor-not-allowed disabled:opacity-50" 
                    type="text" 
                    value={link.url}
                    onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                  />
                  <label htmlFor={`link-url-${link.id}`} className="absolute left-[8px] top-[9px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-link">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </svg>
                  </label>
                </div>
              </div>
              <button 
                className="flex h-7 w-full shrink-0 items-center justify-center border-t border-red-200 bg-red-100 text-red-700 disabled:cursor-not-allowed disabled:opacity-70"
                onClick={() => removeLink(link.id)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
                <span className="ml-2 text-sm">Eliminar</span>
              </button>
            </div>
          ))}
          <button 
            className="mt-2.5 flex h-8 w-full items-center justify-center rounded-sm border border-gray-200 text-sm font-medium hover:bg-gray-100"
            onClick={addLink}
          >
            Agregar Enlace
          </button>
        </div>
      </div>
    );
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
    <div 
      className="fixed right-0 w-80 bg-white border-l border-gray-200 z-[100] flex flex-col shadow-lg properties-panel"
      style={{
        top: '5rem',
        height: 'calc(100vh - 5rem)'
      }}
    >

      {/* Pestañas para tema, subtema y tarea */}
      {shouldShowTabs && (
        <div className="flex gap-2 px-4 py-4 border-b border-gray-100">
          <button 
            className={`focus:outline-hidden rounded-full px-3 py-1 text-sm font-medium ${
              propertiesTab === 'properties' 
                ? 'bg-gray-200 text-black' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
            onClick={() => onTabChange('properties')}
          >
            Propiedades
          </button>
          <button 
            className={`focus:outline-hidden rounded-full px-3 py-1 text-sm font-medium ${
              propertiesTab === 'content' 
                ? 'bg-gray-200 text-black' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
            onClick={() => onTabChange('content')}
          >
            Contenido y Enlaces
          </button>
        </div>
      )}
      
      {/* Contenido de propiedades */}
      <div className="grow basis-0 overflow-hidden overflow-y-auto p-4">
        {selectedEdge ? (
          // Mostrar propiedades de flecha si se seleccionó una
          renderEdgeProperties()
        ) : shouldShowTabs ? (
          propertiesTab === 'properties' ? (
            <div className="flex flex-col">
              {/* Propiedades específicas del tipo de nodo */}
              {renderPropertiesTab()}

              <hr className="my-5 border-gray-200" />

              {/* Controles de tamaño de fuente - excluir líneas */}
              {nodeType !== 'horizontal-line' && nodeType !== 'vertical-line' && (
                <div className="mt-4 flex flex-col">
                  <label className="text-xs uppercase text-gray-400">Tamaño de Fuente</label>
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
              )}

              {/* Control de color del nodo - solo para tema y subtema */}
              {(selectedNode.data.nodeType === 'topic' || selectedNode.data.nodeType === 'subtopic') && (
                <>
                  <div className="mt-4 flex flex-col">
                    <label className="text-xs uppercase text-gray-400">Color del Nodo</label>
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
            </div>
          ) : renderContentAndLinksTab()
        ) : (
          <div className="flex flex-col">
            {/* Propiedades específicas del tipo de nodo */}
            {renderPropertiesTab()}

            {/* Separador solo si no es un nodo title o paragraph */}
            {nodeType !== 'title' && nodeType !== 'paragraph' && <hr className="my-5 border-gray-200" />}

            {/* Controles de tamaño de fuente - excluir líneas */}
            {nodeType !== 'horizontal-line' && nodeType !== 'vertical-line' && (
              <div className={`${nodeType === 'title' ? 'mt-2' : nodeType === 'paragraph' ? 'mt-2' : 'mt-4'} flex flex-col`}>
                <label className="text-xs uppercase text-gray-400">Tamaño de Fuente</label>
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
            )}

            {/* Control de color del nodo - solo para tema y subtema */}
            {(selectedNode.data.nodeType === 'topic' || selectedNode.data.nodeType === 'subtopic') && (
              <>
                <div className="mt-4 flex flex-col">
                  <label className="text-xs uppercase text-gray-400">Color del Nodo</label>
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
                <div className="mt-2 flex flex-col">
                  <label className="text-xs uppercase text-gray-400">Color de Fondo</label>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => onUpdateNode(selectedNode.id, 'backgroundColor', 'transparent')}
                      className={`flex h-6 w-6 min-w-max shrink-0 items-center justify-center rounded-md border px-1 text-sm font-medium uppercase ${
                        selectedNode.data.backgroundColor === 'transparent' || !selectedNode.data.backgroundColor ? 'ring-2 ring-blue-500' : ''
                      }`}
                      style={{
                        backgroundColor: 'transparent',
                        color: '#000000',
                        borderColor: '#e5e7eb'
                      }}
                    >
                      T
                    </button>
                    <button
                      onClick={() => onUpdateNode(selectedNode.id, 'backgroundColor', '#ffffff')}
                      className={`flex h-6 w-6 min-w-max shrink-0 items-center justify-center rounded-md border px-1 text-sm font-medium uppercase ${
                        selectedNode.data.backgroundColor === '#ffffff' ? 'ring-2 ring-blue-500' : ''
                      }`}
                      style={{
                        backgroundColor: '#ffffff',
                        color: '#000000',
                        borderColor: '#d1d5db'
                      }}
                    >
                      B
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesPanel; 