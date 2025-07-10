import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiPrinter, FiShare2, FiMessageSquare } from 'react-icons/fi';
import GraphLayout from './GraphLayout';

export default function TermodinamicaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Espacio superior igual al margen entre cajas */}
      <div className="h-4 sm:h-6 md:h-8 lg:h-10" />
      
      {/* Contenedor del encabezado con márgenes responsivos */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 mb-4 sm:mb-6 md:mb-8 lg:mb-10">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-4 sm:p-6">
            {/* Botones en la parte superior */}
            <div className="flex items-center justify-between mb-4">
              {/* All Roadmaps - Extremo izquierdo */}
              <div className="flex items-center">
                <Link to="/" className="flex items-center px-3 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-semibold hover:bg-gray-300 transition">
                  <FiArrowLeft className="mr-2" />
                  <span className="hidden sm:inline">All Roadmaps</span>
                  <span className="sm:hidden">All</span>
                </Link>
              </div>

              {/* Botones de acción - Extremo derecho */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                {/* Botón Imprimir */}
                <button
                  className="flex items-center px-3 py-2 bg-orange-500 text-white rounded-md text-xs font-semibold hover:bg-orange-600 transition"
                  onClick={() => window.print()}
                  title="Imprimir"
                >
                  <FiPrinter className="mr-1" />
                  <span className="hidden sm:inline">Imprimir</span>
                </button>
                {/* Botón Compartir */}
                <button
                  className="flex items-center px-3 py-2 bg-orange-500 text-white rounded-md text-xs font-semibold hover:bg-orange-600 transition"
                  onClick={() => navigator.share ? navigator.share({ title: document.title, url: window.location.href }) : alert('Función no soportada en este navegador.')}
                  title="Compartir"
                >
                  <FiShare2 className="mr-1" />
                  <span className="hidden sm:inline">Compartir</span>
                </button>
              </div>
            </div>

            {/* Título y descripción */}
            <div className="mb-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 select-none pointer-events-none">
                🔥 Termodinámica Metalúrgica
              </h1>
              <p className="text-sm sm:text-lg text-gray-600">
                Mapa mental interactivo de conceptos fundamentales de termodinámica aplicada a procesos metalúrgicos
              </p>
            </div>

            {/* Botón de sugerencias - Extremo inferior derecho */}
            <div className="flex justify-end">
              <button className="flex items-center px-3 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-semibold hover:bg-gray-300 transition">
                <FiMessageSquare className="mr-2" />
                <span className="hidden sm:inline">Sugerencias</span>
                <span className="sm:hidden">Sug</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contenedor del mapa mental con márgenes responsivos */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 mb-4 sm:mb-6 md:mb-8 lg:mb-10">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="h-[calc(100vh-200px)] min-h-[500px] sm:min-h-[600px]">
            <GraphLayout />
          </div>
        </div>
      </div>
    </div>
  );
} 