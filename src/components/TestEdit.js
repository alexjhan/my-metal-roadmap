import React from 'react';
import { useNavigate } from 'react-router-dom';

const TestEdit = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">¡Página de Edición Funcionando!</h1>
        <p className="text-gray-600 mb-6">Esta es la página de edición de Termodinámica</p>
        <button
          onClick={() => navigate('/termodinamica')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Volver al Roadmap
        </button>
      </div>
    </div>
  );
};

export default TestEdit; 