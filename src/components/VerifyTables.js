import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const VerifyTables = () => {
  const [tableStatus, setTableStatus] = useState({});
  const [loading, setLoading] = useState(true);

  const checkTable = async (tableName) => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('count')
        .limit(1);

      if (error) {
        console.error(`Error checking ${tableName}:`, error);
        return { exists: false, error: error.message };
      } else {
        console.log(`✅ Table ${tableName} exists and accessible`);
        return { exists: true, error: null };
      }
    } catch (err) {
      console.error(`Error checking ${tableName}:`, err);
      return { exists: false, error: err.message };
    }
  };

  const verifyAllTables = async () => {
    setLoading(true);
    const tables = ['roadmap_versions', 'roadmap_votes', 'edit_proposals'];
    const results = {};

    for (const table of tables) {
      results[table] = await checkTable(table);
    }

    setTableStatus(results);
    setLoading(false);
  };

  useEffect(() => {
    verifyAllTables();
  }, []);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <h4 className="font-medium text-blue-800 mb-2">Verificación de Tablas</h4>
      <div className="text-sm text-blue-700">
        {loading ? (
          <p>Verificando tablas...</p>
        ) : (
          <div>
            {Object.entries(tableStatus).map(([tableName, status]) => (
              <div key={tableName} className="mb-2">
                <span className={`font-medium ${status.exists ? 'text-green-600' : 'text-red-600'}`}>
                  {status.exists ? '✅' : '❌'} {tableName}:
                </span>
                {status.exists ? (
                  <span className="text-green-600"> Existe y es accesible</span>
                ) : (
                  <span className="text-red-600"> {status.error}</span>
                )}
              </div>
            ))}
            <button 
              onClick={verifyAllTables}
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
            >
              Verificar Nuevamente
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyTables; 