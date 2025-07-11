import React, { useEffect, useState } from 'react';
import data from '../data/metal_roadmaps.json';
import { useNavigate } from 'react-router-dom';
import ConfigAlert from './ConfigAlert';
import { supabase } from '../lib/supabase';
import Auth from './Auth';
import { useUser } from '../UserContext';

export default function RoadmapGrid() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [showAuth, setShowAuth] = useState(false);

  const handleCardClick = (item) => {
    if (item.status === "active") {
      navigate(item.link);
    } else {
      alert(`Próximamente: ${item.title} - Esta funcionalidad estará disponible pronto!`);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-r from-blue-100 via-indigo-100 to-blue-200 py-10">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-20">
        {/* Alerta de configuración */}
        <ConfigAlert />
        
        {/* Título y subtítulo */}
        <div className="text-center mb-8 pt-8 pb-4">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-yellow-500 to-blue-800 bg-clip-text text-transparent animate-gradient-x px-4 py-2 select-none pointer-events-none">
            MetalRoadmap para Ingenieros Metalúrgicos
          </h1>
          <p className="text-lg text-slate-700 mb-6">
            Explora los mejores recursos y guías para convertirte en un experto en ingeniería metalúrgica. Cada tarjeta representa un roadmap único con recursos valiosos.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-20">
        {/* Grid de roadmaps organizados por categorías */}
        <div className="p-0">
          {/* Línea y título "Ciencias Básicas" */}
          <div className="relative mb-8">
            <div className="absolute top-1/2 left-0 right-0 border-t border-indigo-400" style={{left: 'calc(-50vw + 50%)', right: 'calc(-50vw + 50%)'}}></div>
            <div className="text-center">
              <h2 className="text-base font-bold text-indigo-800 border border-indigo-400 rounded-xl px-3 py-1 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 inline-block relative z-10">Ciencias Básicas</h2>
            </div>
          </div>
          
          {/* Ciencias Básicas */}
          <div className="mb-8">
            <div className="grid grid-cols-1 gap-4 px-2 sm:grid-cols-2 sm:px-0 lg:grid-cols-3">
              {data.slice(0, 12).map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleCardClick(item)}
                  className={`p-2 rounded-xl shadow-lg hover:shadow-xl transition cursor-pointer transform hover:scale-105 duration-200 border ${
                    item.status === 'coming-soon' ? 'bg-slate-100 border-slate-300 opacity-90' : 'bg-white border-indigo-200'
                  }`}
                >
                  <h2 className={`text-lg font-semibold mb-1 ${
                    item.status === 'coming-soon' ? 'text-slate-600' : 'text-slate-900'
                  }`}>
                    <span className={item.status === 'coming-soon' ? 'grayscale' : ''}>{item.icon}</span> {item.title}
                  </h2>
                  <p className={`text-xs mb-2 ${
                    item.status === 'coming-soon' ? 'text-slate-500' : 'text-slate-600'
                  }`}>
                    {item.description.length > 80 ? item.description.slice(0, 80) + '...' : item.description}
                  </p>
                  {item.status === "active" ? (
                    <div className="mt-2 text-xs text-indigo-600 font-medium">
                      ✨ Haz click para explorar
                    </div>
                  ) : (
                    <div className="mt-2 text-xs text-slate-500 font-medium">
                      
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* Botón Crear Roadmap al final de Ciencias Básicas */}
            {!user && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setShowAuth(true)}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105"
                >
                  <span className="mr-2">✨</span>
                  Crear Mi Roadmap en Ciencias Básicas
                </button>
              </div>
            )}
          </div>

          {/* Línea y título "Ingeniería Metalúrgica Extractiva" */}
          <div className="relative mb-8">
            <div className="absolute top-1/2 left-0 right-0 border-t border-indigo-400" style={{left: 'calc(-50vw + 50%)', right: 'calc(-50vw + 50%)'}}></div>
            <div className="text-center">
              <h2 className="text-base font-bold text-indigo-800 border border-indigo-400 rounded-xl px-3 py-1 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 inline-block relative z-10">Ingeniería Metalúrgica Extractiva</h2>
            </div>
          </div>
          
          {/* Ingeniería Metalúrgica Extractiva */}
          <div className="mb-8">
            <div className="grid grid-cols-1 gap-4 px-2 sm:grid-cols-2 sm:px-0 lg:grid-cols-3">
              {data.slice(12, 22).map((item, idx) => (
                <div
                  key={idx + 12}
                  onClick={() => handleCardClick(item)}
                  className={`p-2 rounded-xl shadow-lg hover:shadow-xl transition cursor-pointer transform hover:scale-105 duration-200 border ${
                    item.status === 'coming-soon' ? 'bg-slate-100 border-slate-300 opacity-90' : 'bg-white border-indigo-200'
                  }`}
                >
                  <h2 className={`text-lg font-semibold mb-1 ${
                    item.status === 'coming-soon' ? 'text-slate-600' : 'text-slate-900'
                  }`}>
                    <span className={item.status === 'coming-soon' ? 'grayscale' : ''}>{item.icon}</span> {item.title}
                  </h2>
                  <p className={`text-xs mb-2 ${
                    item.status === 'coming-soon' ? 'text-slate-500' : 'text-slate-600'
                  }`}>
                    {item.description.length > 80 ? item.description.slice(0, 80) + '...' : item.description}
                  </p>
                  {item.status === "active" ? (
                    <div className="mt-2 text-xs text-indigo-600 font-medium">
                      ✨ Haz click para explorar
                    </div>
                  ) : (
                    <div className="mt-2 text-xs text-slate-500 font-medium">
                      
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* Botón Crear Roadmap al final de Extractiva */}
            {!user && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setShowAuth(true)}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105"
                >
                  <span className="mr-2">✨</span>
                  Crear Mi Roadmap en Extractiva
                </button>
              </div>
            )}
          </div>

          {/* Línea y título "Ingeniería Metalúrgica Transformativa" */}
          <div className="relative mb-8">
            <div className="absolute top-1/2 left-0 right-0 border-t border-indigo-400" style={{left: 'calc(-50vw + 50%)', right: 'calc(-50vw + 50%)'}}></div>
            <div className="text-center">
              <h2 className="text-base font-bold text-indigo-800 border border-indigo-400 rounded-xl px-3 py-1 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 inline-block relative z-10">Ingeniería Metalúrgica Transformativa</h2>
            </div>
          </div>
          
          {/* Ingeniería Metalúrgica Transformativa */}
          <div className="mb-8">
            <div className="grid grid-cols-1 gap-4 px-2 sm:grid-cols-2 sm:px-0 lg:grid-cols-3">
              {data.slice(22, 32).map((item, idx) => (
                <div
                  key={idx + 22}
                  onClick={() => handleCardClick(item)}
                  className={`p-2 rounded-xl shadow-lg hover:shadow-xl transition cursor-pointer transform hover:scale-105 duration-200 border ${
                    item.status === 'coming-soon' ? 'bg-slate-100 border-slate-300 opacity-90' : 'bg-white border-indigo-200'
                  }`}
                >
                  <h2 className={`text-lg font-semibold mb-1 ${
                    item.status === 'coming-soon' ? 'text-slate-600' : 'text-slate-900'
                  }`}>
                    <span className={item.status === 'coming-soon' ? 'grayscale' : ''}>{item.icon}</span> {item.title}
                  </h2>
                  <p className={`text-xs mb-2 ${
                    item.status === 'coming-soon' ? 'text-slate-500' : 'text-slate-600'
                  }`}>
                    {item.description.length > 80 ? item.description.slice(0, 80) + '...' : item.description}
                  </p>
                  {item.status === "active" ? (
                    <div className="mt-2 text-xs text-indigo-600 font-medium">
                      ✨ Haz click para explorar
                    </div>
                  ) : (
                    <div className="mt-2 text-xs text-slate-500 font-medium">
                      
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* Botón Crear Roadmap al final de Transformativa */}
            {!user && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setShowAuth(true)}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105"
                >
                  <span className="mr-2">✨</span>
                  Crear Mi Roadmap en Transformativa
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Auth para login flotante */}
      {showAuth && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
            <button onClick={() => setShowAuth(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-3xl font-bold leading-none focus:outline-none" style={{lineHeight: '1', width: '2.5rem', height: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>&times;</button>
            <Auth />
          </div>
        </div>
      )}
    </div>
  );
}
