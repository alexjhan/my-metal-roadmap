import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const DebugVersions = ({ roadmapType }) => {
  const [allVersions, setAllVersions] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadAllVersions = async () => {
    try {
      setLoading(true);
      console.log('Debug: Cargando todas las versiones para:', roadmapType);
      
      const { data: versions, error } = await supabase
        .from('roadmap_versions')
        .select('*')
        .eq('roadmap_type', roadmapType);

      if (error) {
        console.error('Error cargando versiones:', error);
        return;
      }

      console.log('Debug: Versiones encontradas:', versions);
      setAllVersions(versions || []);
    } catch (error) {
      console.error('Error en debug:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllVersions();
  }, [roadmapType]);

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <h4 className="font-medium text-yellow-800 mb-2">Debug: Versiones Guardadas</h4>
      <div className="text-sm text-yellow-700">
        <p>Roadmap: {roadmapType}</p>
        <p>Total versiones: {allVersions.length}</p>
        {loading && <p>Cargando...</p>}
        {allVersions.length > 0 && (
          <div className="mt-2">
            <p className="font-medium">Versiones encontradas:</p>
            <ul className="list-disc list-inside mt-1">
              {allVersions.map((version, index) => (
                <li key={version.id}>
                  ID: {version.id} | Público: {version.is_public ? 'Sí' : 'No'} | 
                  Votos: {version.total_votes} | 
                  Fecha: {new Date(version.created_at).toLocaleString()}
                </li>
              ))}
            </ul>
          </div>
        )}
        <button 
          onClick={loadAllVersions}
          className="mt-2 px-3 py-1 bg-yellow-500 text-white rounded text-xs hover:bg-yellow-600"
        >
          Recargar
        </button>
      </div>
    </div>
  );
};

export default DebugVersions; 