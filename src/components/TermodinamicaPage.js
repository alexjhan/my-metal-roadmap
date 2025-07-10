import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiPrinter, FiShare2 } from 'react-icons/fi';
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              {/* Botones a la izquierda */}
              <div className="flex items-center space-x-2 sm:space-x-4 mr-0 sm:mr-6">
                {/* AllRoadmaps: botón en móvil, texto en desktop */}
                <Link to="/" className="block">
                  <span className="sm:hidden">
                    <button className="flex items-center px-3 py-2 bg-gray-200 text-gray-700 rounded-md text-xs font-semibold hover:bg-gray-300 transition">
                      <FiArrowLeft className="mr-1" /> AllRoadmaps
                    </button>
                  </span>
                  <span className="hidden sm:inline text-base font-semibold text-gray-500 hover:text-blue-600 transition">
                    AllRoadmaps
                  </span>
                </Link>
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
              {/* Info principal del encabezado */}
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  🔥 Termodinámica Metalúrgica
                </h1>
                <p className="mt-2 text-sm sm:text-lg text-gray-600">
                  Mapa mental interactivo de conceptos fundamentales de termodinámica aplicada a procesos metalúrgicos
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="text-xs sm:text-sm text-gray-500">
                  <span className="font-medium">Nodos:</span> 18 conceptos
                </div>
                <div className="text-xs sm:text-sm text-gray-500">
                  <span className="font-medium">Conexiones:</span> 16 relaciones
                </div>
              </div>
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