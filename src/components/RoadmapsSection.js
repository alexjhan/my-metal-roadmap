import React from 'react';

export default function RoadmapsSection() {
  return (
    <section className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-20 mb-10">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">¿Qué es un Roadmap?</h2>
        <p className="text-gray-700 mb-2">
          Un roadmap es una guía visual que te ayuda a entender y organizar los conceptos clave de una disciplina. Aquí encontrarás mapas mentales interactivos para cada área de la ingeniería metalúrgica.
        </p>
        <ul className="list-disc pl-6 text-gray-700">
          <li>Visualiza relaciones entre conceptos.</li>
          <li>Accede a recursos recomendados.</li>
          <li>Descubre rutas de aprendizaje sugeridas.</li>
        </ul>
      </div>
    </section>
  );
}
