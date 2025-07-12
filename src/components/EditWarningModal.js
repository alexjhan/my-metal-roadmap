import React from 'react';

export default function EditWarningModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative text-center">
        <h2 className="text-xl font-bold mb-4 text-yellow-600">Advertencia</h2>
        <p className="mb-6 text-gray-700">
          La edición no está disponible en dispositivos móviles o pantallas pequeñas. Por favor, utiliza una computadora o amplía la ventana para editar el roadmap.
        </p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
} 