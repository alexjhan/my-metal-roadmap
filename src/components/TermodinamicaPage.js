import React from 'react';
import { Link } from 'react-router-dom';

export default function TermodinamicaPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 mb-2">
                Termodinámica Metalúrgica
              </h1>
              <p className="text-lg text-gray-600">
                La termodinámica es la rama de la física que estudia las transformaciones de la energía y su relación con la materia. Es fundamental en los procesos metalúrgicos para entender el comportamiento de los materiales y la eficiencia de los procesos.
              </p>
            </div>
            <Link 
              to="/" 
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              ← Volver al Inicio
            </Link>
          </div>
        </div>
      </div>

      {/* Recursos adicionales (opcional) */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Recursos recomendados</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li><a href="https://es.wikipedia.org/wiki/Termodin%C3%A1mica" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Wikipedia: Termodinámica</a></li>
          <li><a href="https://www.youtube.com/watch?v=QKq5gCydlG8" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Video: Introducción a la Termodinámica</a></li>
          <li><a href="https://www.sciencedirect.com/topics/engineering/thermodynamics" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Artículos en ScienceDirect</a></li>
        </ul>
      </div>
    </div>
  );
} 