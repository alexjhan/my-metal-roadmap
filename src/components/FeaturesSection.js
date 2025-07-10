import React from 'react';

export default function FeaturesSection() {
  return (
    <section className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-20 mb-10">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Características Destacadas</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
          <li className="flex items-start">
            <span className="text-2xl mr-3">🧭</span>
            Mapas mentales interactivos y navegables
          </li>
          <li className="flex items-start">
            <span className="text-2xl mr-3">📚</span>
            Recursos curados por expertos
          </li>
          <li className="flex items-start">
            <span className="text-2xl mr-3">🛠️</span>
            Proyectos y simulaciones prácticas
          </li>
          <li className="flex items-start">
            <span className="text-2xl mr-3">🌐</span>
            Comunidad y colaboración
          </li>
        </ul>
      </div>
    </section>
  );
}
