import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPrinter, FiShare2, FiMessageSquare } from 'react-icons/fi';

export default function RoadmapLayout({ 
  title, 
  description, 
  icon, 
  children, 
  onBackClick,
  showPrintButton = true,
  showShareButton = true,
  showSuggestionsButton = true,
  customBackText = "All Roadmaps"
}) {
  const navigate = useNavigate();

  // Scroll automático al contenido cuando se carga la página
  useEffect(() => {
    // Pequeño delay para asegurar que el contenido esté renderizado
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate('/');
      // Forzar recarga de la página después de un pequeño delay
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Espacio superior reducido para móviles */}
      <div className="h-2 sm:h-4 md:h-6 lg:h-8" />
      
      {/* Contenedor del encabezado con márgenes responsivos mejorados */}
      <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 mb-4 sm:mb-6 md:mb-8 lg:mb-10">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-4 sm:p-6">
            {/* Botones en la parte superior */}
            <div className="flex items-center justify-between mb-4">
              {/* Botón de regreso - Extremo izquierdo */}
              <div className="flex items-center">
                <button
                  onClick={handleBackClick}
                  className="flex items-center px-3 sm:px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-xs sm:text-sm font-semibold hover:bg-gray-300 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <FiArrowLeft className="mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">{customBackText}</span>
                  <span className="sm:hidden">All</span>
                </button>
              </div>

              {/* Botones de acción - Extremo derecho */}
              <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
                {/* Botón Imprimir */}
                {showPrintButton && (
                  <button
                    className="flex items-center px-2 sm:px-3 py-2 bg-orange-500 text-white rounded-md text-xs font-semibold hover:bg-orange-600 transition"
                    onClick={() => window.print()}
                    title="Imprimir"
                  >
                    <FiPrinter className="mr-1" />
                    <span className="hidden sm:inline">Imprimir</span>
                  </button>
                )}
                {/* Botón Compartir */}
                {showShareButton && (
                  <button
                    className="flex items-center px-2 sm:px-3 py-2 bg-orange-500 text-white rounded-md text-xs font-semibold hover:bg-orange-600 transition"
                    onClick={() => navigator.share ? navigator.share({ title: document.title, url: window.location.href }) : alert('Función no soportada en este navegador.')}
                    title="Compartir"
                  >
                    <FiShare2 className="mr-1" />
                    <span className="hidden sm:inline">Compartir</span>
                  </button>
                )}
              </div>
            </div>

            {/* Título y descripción - Reducido para móviles */}
            <div className="mb-4">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 select-none pointer-events-none">
                {icon} {title}
              </h1>
              <p className="text-xs sm:text-sm md:text-lg text-gray-600">
                {description}
              </p>
            </div>

            {/* Botón de sugerencias - Extremo inferior derecho */}
            {showSuggestionsButton && (
              <div className="flex justify-end">
                <button className="flex items-center px-2 sm:px-3 py-2 bg-gray-200 text-gray-700 rounded-md text-xs sm:text-sm font-semibold hover:bg-gray-300 transition">
                  <FiMessageSquare className="mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Sugerencias</span>
                  <span className="sm:hidden">Sug</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Contenedor del contenido con márgenes responsivos mejorados */}
      <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 mb-4 sm:mb-6 md:mb-8 lg:mb-10">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="h-[calc(100vh-200px)] min-h-[500px] sm:min-h-[600px]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
} 