import React, { useState } from 'react';
import { useUser } from '../UserContext';
import { supabase } from '../lib/supabase';

const CreateProposalModal = ({ version, onClose, onProposalCreated }) => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    changes: [
      {
        type: 'node',
        action: 'add',
        before: '',
        after: ''
      }
    ]
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleChangeChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      changes: prev.changes.map((change, i) => 
        i === index ? { ...change, [field]: value } : change
      )
    }));
  };

  const addChange = () => {
    setFormData(prev => ({
      ...prev,
      changes: [...prev.changes, {
        type: 'node',
        action: 'add',
        before: '',
        after: ''
      }]
    }));
  };

  const removeChange = (index) => {
    setFormData(prev => ({
      ...prev,
      changes: prev.changes.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Debes iniciar sesión para crear una propuesta');
      return;
    }

    if (!formData.title.trim()) {
      alert('Debes agregar un título a la propuesta');
      return;
    }

    if (formData.changes.every(change => !change.after.trim())) {
      alert('Debes agregar al menos un cambio');
      return;
    }

    try {
      setLoading(true);

      // Aquí deberías conectar con tu base de datos
      // Por ahora simulamos la creación
      const newProposal = {
        id: Date.now(),
        version_id: version.id,
        author: { name: user.email || 'Usuario' },
        title: formData.title,
        description: formData.description,
        changes: formData.changes.filter(change => change.after.trim()),
        created_at: new Date().toISOString(),
        status: 'pending',
        votes: [],
        comments: []
      };

      // Simular guardado en base de datos
      console.log('Creando propuesta:', newProposal);
      
      // Aquí iría la llamada real a Supabase
      // const { data, error } = await supabase
      //   .from('proposals')
      //   .insert([newProposal]);

      onProposalCreated(newProposal);
      onClose();
    } catch (error) {
      console.error('Error creating proposal:', error);
      alert('Error al crear la propuesta: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Nueva Propuesta de Edición</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Creando propuesta para la versión del {new Date(version.created_at).toLocaleDateString('es-ES')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título de la propuesta *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe brevemente tu propuesta..."
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción (opcional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Explica el razonamiento detrás de tus cambios..."
            />
          </div>

          {/* Cambios */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Cambios propuestos *
              </label>
              <button
                type="button"
                onClick={addChange}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Agregar cambio</span>
              </button>
            </div>

            <div className="space-y-4">
              {formData.changes.map((change, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-900">
                      Cambio #{index + 1}
                    </h4>
                    {formData.changes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeChange(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Tipo
                      </label>
                      <select
                        value={change.type}
                        onChange={(e) => handleChangeChange(index, 'type', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="node">Nodo</option>
                        <option value="connection">Conexión</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Acción
                      </label>
                      <select
                        value={change.action}
                        onChange={(e) => handleChangeChange(index, 'action', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="add">Agregar</option>
                        <option value="modify">Modificar</option>
                        <option value="remove">Eliminar</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Estado actual (opcional)
                      </label>
                      <input
                        type="text"
                        value={change.before}
                        onChange={(e) => handleChangeChange(index, 'before', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Texto actual..."
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Nuevo contenido *
                    </label>
                    <textarea
                      value={change.after}
                      onChange={(e) => handleChangeChange(index, 'after', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      rows={2}
                      placeholder="Describe el nuevo contenido..."
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Nota:</span> Tu propuesta será revisada por la comunidad
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creando...' : 'Crear Propuesta'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProposalModal; 