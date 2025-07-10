import React from 'react';
import data from '../data/metal_roadmaps.json';
import { useNavigate } from 'react-router-dom';

export default function RoadmapGrid() {
  const navigate = useNavigate();

  const handleCardClick = (item) => {
    if (item.status === "active") {
      navigate(item.link);
    } else {
      alert(`Próximamente: ${item.title} - Esta funcionalidad estará disponible pronto!`);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-r from-sky-100 via-blue-50 to-cyan-100 py-10">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-20">
        {/* Título y subtítulo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">MetalRoadmap para Ingenieros Metalúrgicos</h1>
          <p className="text-lg text-blue-800">
            Explora los mejores recursos y guías para convertirte en un experto en ingeniería metalúrgica. Cada tarjeta representa un roadmap único con recursos valiosos.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-20">
        {/* Grid de roadmaps organizados por categorías */}
        <div className="p-0">
          {/* Línea y título "Ciencias Básicas" */}
          <div className="relative mb-8">
            <div className="absolute top-1/2 left-0 right-0 border-t border-blue-600" style={{left: '-50vw', right: '-50vw'}}></div>
            <div className="text-center">
              <h2 className="text-base font-bold text-blue-900 border border-blue-600 rounded-xl px-3 py-1 bg-gradient-to-r from-sky-100 via-blue-50 to-cyan-100 inline-block relative z-10">Ciencias Básicas</h2>
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
                    item.status === 'coming-soon' ? 'bg-gray-100 border-gray-300 opacity-90' : 'bg-white border-gray-100'
                  }`}
                >
                  <h2 className={`text-lg font-semibold mb-1 ${
                    item.status === 'coming-soon' ? 'text-gray-600' : 'text-gray-900'
                  }`}>
                    <span className={item.status === 'coming-soon' ? 'grayscale' : ''}>{item.icon}</span> {item.title}
                  </h2>
                  <p className={`text-xs mb-2 ${
                    item.status === 'coming-soon' ? 'text-gray-500' : 'text-gray-600'
                  }`}>
                    {item.description.length > 80 ? item.description.slice(0, 80) + '...' : item.description}
                  </p>
                  {item.status === "active" ? (
                    <div className="mt-2 text-xs text-blue-600 font-medium">
                      ✨ Haz click para explorar
                    </div>
                  ) : (
                    <div className="mt-2 text-xs text-gray-500 font-medium">
                      
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Línea y título "Ingeniería Metalúrgica Extractiva" */}
          <div className="relative mb-8">
            <div className="absolute top-1/2 left-0 right-0 border-t border-blue-600" style={{left: '-50vw', right: '-50vw'}}></div>
            <div className="text-center">
              <h2 className="text-base font-bold text-blue-900 border border-blue-600 rounded-xl px-3 py-1 bg-gradient-to-r from-sky-100 via-blue-50 to-cyan-100 inline-block relative z-10">Ingeniería Metalúrgica Extractiva</h2>
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
                    item.status === 'coming-soon' ? 'bg-gray-100 border-gray-300 opacity-90' : 'bg-white border-gray-100'
                  }`}
                >
                  <h2 className={`text-lg font-semibold mb-1 ${
                    item.status === 'coming-soon' ? 'text-gray-600' : 'text-gray-900'
                  }`}>
                    <span className={item.status === 'coming-soon' ? 'grayscale' : ''}>{item.icon}</span> {item.title}
                  </h2>
                  <p className={`text-xs mb-2 ${
                    item.status === 'coming-soon' ? 'text-gray-500' : 'text-gray-600'
                  }`}>
                    {item.description.length > 80 ? item.description.slice(0, 80) + '...' : item.description}
                  </p>
                  {item.status === "active" ? (
                    <div className="mt-2 text-xs text-blue-600 font-medium">
                      ✨ Haz click para explorar
                    </div>
                  ) : (
                    <div className="mt-2 text-xs text-gray-500 font-medium">
                      
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Línea y título "Ingeniería Metalúrgica Transformativa" */}
          <div className="relative mb-8">
            <div className="absolute top-1/2 left-0 right-0 border-t border-blue-600" style={{left: '-50vw', right: '-50vw'}}></div>
            <div className="text-center">
              <h2 className="text-base font-bold text-blue-900 border border-blue-600 rounded-xl px-3 py-1 bg-gradient-to-r from-sky-100 via-blue-50 to-cyan-100 inline-block relative z-10">Ingeniería Metalúrgica Transformativa</h2>
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
                    item.status === 'coming-soon' ? 'bg-gray-100 border-gray-300 opacity-90' : 'bg-white border-gray-100'
                  }`}
                >
                  <h2 className={`text-lg font-semibold mb-1 ${
                    item.status === 'coming-soon' ? 'text-gray-600' : 'text-gray-900'
                  }`}>
                    <span className={item.status === 'coming-soon' ? 'grayscale' : ''}>{item.icon}</span> {item.title}
                  </h2>
                  <p className={`text-xs mb-2 ${
                    item.status === 'coming-soon' ? 'text-gray-500' : 'text-gray-600'
                  }`}>
                    {item.description.length > 80 ? item.description.slice(0, 80) + '...' : item.description}
                  </p>
                  {item.status === "active" ? (
                    <div className="mt-2 text-xs text-blue-600 font-medium">
                      ✨ Haz click para explorar
                    </div>
                  ) : (
                    <div className="mt-2 text-xs text-gray-500 font-medium">
                      
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
