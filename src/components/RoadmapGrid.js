import React, { useEffect, useState } from 'react';
import data from '../data/metal_roadmaps.json';
import { useNavigate } from 'react-router-dom';
import ConfigAlert from './ConfigAlert';
import { supabase } from '../lib/supabase';
import Auth from './Auth';
import { useUser } from '../UserContext';
import SelectRoadmapModal from './SelectRoadmapModal';

export default function RoadmapGrid() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [showAuth, setShowAuth] = useState(false);
  const [showSelectRoadmapModal, setShowSelectRoadmapModal] = useState(false);

  const handleCardClick = (item) => {
    if (item.status === "active") {
      navigate(item.link);
    } else {
      alert(`Próximamente: ${item.title} - Esta funcionalidad estará disponible pronto!`);
    }
  };

  // Organizar los datos por categorías
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

  // Componente para renderizar una categoría
  const renderCategory = (categoryName, items) => (
    <div key={categoryName}>
      {/* Línea y título de la categoría */}
      <div className="relative mb-6">
        <div className="absolute top-1/2 left-0 right-0 border-t border-indigo-400" style={{left: 'calc(-50vw + 50%)', right: 'calc(-50vw + 50%)'}}></div>
        <div className="text-center">
          <h2 className="text-sm font-bold text-indigo-800 border border-indigo-400 rounded-xl px-3 py-1 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 inline-block relative z-10">{categoryName}</h2>
        </div>
      </div>
      
      {/* Grid de items de la categoría */}
      <div className="mb-6">
        <div className="grid grid-cols-1 gap-2 px-4 sm:grid-cols-2 sm:px-8 lg:grid-cols-3 lg:px-32 xl:grid-cols-4 xl:px-40 2xl:grid-cols-5 2xl:px-48 3xl:grid-cols-5 3xl:px-56">
          {items.map((item, idx) => (
            <div
              key={`${categoryName}-${idx}`}
              onClick={() => handleCardClick(item)}
              className={`p-2 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer transform hover:scale-102 duration-200 border hover:border-indigo-700 ${
                item.status === 'coming-soon' ? 'bg-slate-100 border-slate-300 opacity-90' : 'bg-white border-indigo-200'
              }`}
            >
              <h3 className={`text-sm font-semibold mb-1 ${
                item.status === 'coming-soon' ? 'text-slate-600' : 'text-slate-900'
              }`}>
                <span className={item.status === 'coming-soon' ? 'grayscale' : ''}>{item.icon}</span> {item.title}
              </h3>
              <p className={`text-xs mb-1 ${
                item.status === 'coming-soon' ? 'text-slate-500' : 'text-slate-600'
              }`} style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'block'
              }}>
                {item.description}
              </p>

            </div>
          ))}
        </div>
        {/* Botón Editar Roadmap al final de cada categoría */}
        {!user && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setShowSelectRoadmapModal(true)}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105 text-sm"
            >
              <span className="mr-2">✨</span>
              <span className="hidden sm:inline">Editar Roadmap</span>
              <span className="sm:hidden">Editar Roadmap</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-gradient-to-r from-blue-100 via-indigo-100 to-blue-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-32 xl:px-40 2xl:px-48 3xl:px-56">
        {/* Alerta de configuración */}
        <ConfigAlert />
        
        {/* Título y subtítulo - Responsive con márgenes grandes */}
        <div className="pt-4 pb-4 lg:mb-12 xl:mb-16 2xl:mb-20 3xl:mb-24">
          {/* Título izquierda en móviles, centrado en pantallas grandes */}
          <div className="text-left sm:text-center lg:text-center xl:text-center 2xl:text-center 3xl:text-center px-4 sm:px-8 lg:px-32 xl:px-40 2xl:px-48 3xl:px-56">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-yellow-500 to-blue-800 bg-clip-text text-transparent animate-gradient-x select-none pointer-events-none lg:py-4 xl:py-6 2xl:py-8 3xl:py-10">
              <span className="block sm:hidden">MetalRoad Ing. Metalurgistas</span>
              <span className="hidden sm:block">MetalRoadmap para Ingenieros Metalúrgicos</span>
            </h1>
          </div>
          
          {/* Descripción izquierda en móviles, centrada en pantallas grandes */}
          <div className="text-left sm:text-center px-4 sm:px-8 lg:px-32 xl:px-40 2xl:px-48 3xl:px-56">
            <p className="text-xs sm:text-sm md:text-base text-slate-700">
              Explora los mejores recursos y guías para convertirte en un experto en ingeniería metalúrgica. Cada tarjeta representa un roadmap único con recursos valiosos.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-32 xl:px-40 2xl:px-48 3xl:px-56">
        {/* Grid de roadmaps organizados por categorías */}
        <div className="p-0">
          {/* Renderizar cada categoría en el orden especificado */}
          {renderCategory("Ciencias Básicas", categories["Ciencias Básicas"] || [])}
          {renderCategory("Extractiva", categories["Extractiva"] || [])}
          {renderCategory("Transformativa", categories["Transformativa"] || [])}
          {renderCategory("Herramientas Extractivas", categories["Herramientas Extractivas"] || [])}
          {renderCategory("Herramientas Transformativas", categories["Herramientas Transformativas"] || [])}
        </div>
      </div>

      {/* Modal de autenticación */}
      {showAuth && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button 
              onClick={() => setShowAuth(false)} 
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-3xl font-bold leading-none focus:outline-none"
              style={{lineHeight: '1', width: '2.5rem', height: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
            >
              &times;
            </button>
            <Auth onClose={() => setShowAuth(false)} />
          </div>
        </div>
      )}

      {/* Modal de selección de roadmap */}
      <SelectRoadmapModal 
        isOpen={showSelectRoadmapModal}
        onClose={() => setShowSelectRoadmapModal(false)}
      />
    </div>
  );
}
