import React from 'react';
import data from '../data/metal_roadmaps.json';

export default function RoadmapGrid() {
  return (
    <div className=" mt-28 max-w-6xl mx-auto ml-8 mr-8 p-6 bg-gray-100 rounded-xl shadow-xl">
      <h1 className="mt-2 p-2 text-4xl font-bold text-center mb-8 text-slate-800">
        MetalRoadmap para Ingenieros Metalúrgicos
      </h1>
      <p className="text-center text-lg mb-4 text-gray-700">
        Explora los mejores recursos y guías para convertirte en un experto en ingeniería metalúrgica. Cada tarjeta representa un roadmap único con recursos valiosos.
      </p>
      <div className="grid grid-cols-1 gap-3 px-2 sm:grid-cols-2 sm:px-0 lg:grid-cols-3">
        {data.map((item, idx) => (
          <div key={idx}
            className="p-2 bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer">
            <h2 className="text-xl text-gray-900 font-semibold mb-1">
              {item.icon} {item.title}
            </h2>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
