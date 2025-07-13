import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import data from '../data/metal_roadmaps.json';

const SelectRoadmapModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  if (!isOpen) return null;

  // Organizar roadmaps por categorías
  const organizeByCategory = () => {
    const categories = {};
    data.forEach(item => {
      if (!categories[item.category]) {
        categories[item.category] = [];
      }
      categories[item.category].push(item);
    });
    return categories;
  };

  const categories = organizeByCategory();

  // Filtrar roadmaps basado en búsqueda y categoría
  const filteredRoadmaps = data.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory && item.status === 'active';
  });

  const handleRoadmapSelect = (roadmapType) => {
    navigate(`/edit/${roadmapType}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Seleccionar Roadmap para Editar</h2>
            <p className="text-gray-600 mt-1">Elige el roadmap que deseas editar</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {/* Filtros */}
          <div className="mb-6 space-y-4">
            {/* Buscador */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar roadmaps..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Filtro por categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categoría:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todas las categorías</option>
                <option value="Ciencias Básicas">Ciencias Básicas</option>
                <option value="Extractiva">Extractiva</option>
                <option value="Transformativa">Transformativa</option>
                <option value="Herramientas Extractivas">Herramientas Extractivas</option>
                <option value="Herramientas Transformativas">Herramientas Transformativas</option>
              </select>
            </div>
          </div>

          {/* Grid de roadmaps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {filteredRoadmaps.map((item, index) => (
              <div
                key={index}
                onClick={() => handleRoadmapSelect(item.link.replace('/roadmap/', ''))}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer bg-white"
              >
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredRoadmaps.length === 0 && (
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
              </svg>
              <p className="text-gray-500">No se encontraron roadmaps que coincidan con tu búsqueda</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectRoadmapModal; 