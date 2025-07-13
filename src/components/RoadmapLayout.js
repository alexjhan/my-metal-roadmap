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
  customBackText = "All Roadmaps",
  recognitionPanel = null
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

  const handlePrint = () => {
    // Ocultar elementos que no queremos imprimir
    const elementsToHide = document.querySelectorAll('.no-print');
    elementsToHide.forEach(el => {
      el.style.display = 'none';
    });

    // Agregar estilos de impresión
    const printStyles = document.createElement('style');
    printStyles.textContent = `
      @media print {
        body { margin: 0; padding: 0; }
        .print-container { 
          width: 100% !important; 
          height: auto !important; 
          max-width: none !important;
          margin: 0 !important;
          padding: 20px !important;
        }
        .print-header {
          background: white !important;
          color: black !important;
          padding: 20px !important;
          margin-bottom: 20px !important;
          border: 1px solid #ccc !important;
          border-radius: 8px !important;
        }
        .print-content {
          background: white !important;
          color: black !important;
          padding: 20px !important;
          border: 1px solid #ccc !important;
          border-radius: 8px !important;
          min-height: 600px !important;
        }
        .print-title {
          font-size: 24px !important;
          font-weight: bold !important;
          margin-bottom: 10px !important;
          color: black !important;
        }
        .print-description {
          font-size: 16px !important;
          color: #666 !important;
          margin-bottom: 20px !important;
        }
        .print-info {
          font-size: 12px !important;
          color: #888 !important;
          margin-top: 20px !important;
          text-align: center !important;
        }
        @page { margin: 1cm; }
      }
    `;
    document.head.appendChild(printStyles);

    // Crear contenido de impresión
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title} - MetalRoadmap</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
            .print-container { 
              width: 100%; 
              max-width: 800px; 
              margin: 0 auto; 
              padding: 20px; 
            }
            .print-header {
              background: white;
              color: black;
              padding: 20px;
              margin-bottom: 20px;
              border: 1px solid #ccc;
              border-radius: 8px;
            }
            .print-content {
              background: white;
              color: black;
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 8px;
              min-height: 600px;
            }
            .print-title {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 10px;
              color: black;
            }
            .print-description {
              font-size: 16px;
              color: #666;
              margin-bottom: 20px;
            }
            .print-info {
              font-size: 12px;
              color: #888;
              margin-top: 20px;
              text-align: center;
            }
            @media print {
              @page { margin: 1cm; }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <div class="print-header">
              <div class="print-title">${icon} ${title}</div>
              <div class="print-description">${description}</div>
              <div class="print-info">
                Impreso desde MetalRoadmap - ${new Date().toLocaleDateString()}
              </div>
            </div>
            <div class="print-content">
              <h3>Mapa Mental Interactivo</h3>
              <p>Este roadmap contiene un mapa mental interactivo que se puede explorar en la versión digital.</p>
              <p>Para acceder al contenido completo, visita: ${window.location.href}</p>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();

    // Imprimir y limpiar
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
      
      // Restaurar elementos ocultos
      elementsToHide.forEach(el => {
        el.style.display = '';
      });
      
      // Remover estilos de impresión
      document.head.removeChild(printStyles);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Espacio superior reducido para móviles */}
      <div className="h-2 sm:h-4 md:h-6 lg:h-8" />
      
      {/* Contenedor del encabezado */}
      <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 mb-2">
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
                    onClick={handlePrint}
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

            {/* Panel de reconocimiento y sugerencias */}
            <div className="flex justify-end items-center space-x-2">
              {recognitionPanel ? (
                <div className="flex items-center space-x-3 mr-4 bg-blue-50 p-2 rounded-lg border border-blue-200">
                  {recognitionPanel}
                </div>
              ) : (
                <div className="text-xs text-gray-500 mr-4">Cargando reconocimiento...</div>
              )}
              {showSuggestionsButton && (
                <button className="flex items-center px-2 sm:px-3 py-2 bg-gray-200 text-gray-700 rounded-md text-xs sm:text-sm font-semibold hover:bg-gray-300 transition">
                  <FiMessageSquare className="mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Sugerencias</span>
                  <span className="sm:hidden">Sug</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Contenedor del contenido */}
      <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="h-[calc(100vh-200px)] min-h-[500px] sm:min-h-[600px]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
} 