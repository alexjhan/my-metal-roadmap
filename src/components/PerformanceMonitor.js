import React, { useState, useEffect, useRef } from 'react';
import { performanceConfig, performanceUtils } from '../config/performance';

const PerformanceMonitor = ({ enabled = false }) => {
  const [metrics, setMetrics] = useState({
    memoryUsage: 0,
    renderTime: 0,
    loadTime: 0,
    storageSize: 0,
    storageItems: 0,
    errors: 0
  });
  
  const [isVisible, setIsVisible] = useState(false);
  const intervalRef = useRef(null);
  const errorCountRef = useRef(0);

  useEffect(() => {
    if (!enabled || !performanceConfig.monitoring.enablePerformanceMetrics) {
      return;
    }

    // Capturar errores
    const originalError = console.error;
    console.error = (...args) => {
      errorCountRef.current++;
      originalError.apply(console, args);
    };

    // Iniciar monitoreo
    const startMonitoring = () => {
      // Medir tiempo de carga inicial
      if (performanceConfig.development.enableLoadTimeMeasurement) {
        window.addEventListener('load', () => {
          const loadTime = performance.now();
          setMetrics(prev => ({ ...prev, loadTime }));
        });
      }

      // Monitoreo periódico
      intervalRef.current = setInterval(() => {
        const newMetrics = { ...metrics };

        // Uso de memoria
        if ('memory' in performance) {
          const memory = performance.memory;
          newMetrics.memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024);
        }

        // Estadísticas de almacenamiento
        const storageStats = performanceUtils.getStorageStats();
        newMetrics.storageSize = Math.round(storageStats.totalSize / 1024); // KB
        newMetrics.storageItems = storageStats.items;

        // Contador de errores
        newMetrics.errors = errorCountRef.current;

        setMetrics(newMetrics);
      }, performanceConfig.monitoring.metricsReportInterval);

      // Limpieza automática
      const cleanupInterval = setInterval(() => {
        performanceUtils.cleanup();
      }, 5 * 60 * 1000); // Cada 5 minutos

      return () => {
        clearInterval(cleanupInterval);
      };
    };

    const cleanup = startMonitoring();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (cleanup) {
        cleanup();
      }
      console.error = originalError;
    };
  }, [enabled, metrics]);

  // Medir tiempo de renderizado
  useEffect(() => {
    if (!enabled) return;

    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (renderTime > 16) { // Más de 16ms (60fps)
        console.warn(`Slow render detected: ${renderTime.toFixed(2)}ms`);
      }
      
      setMetrics(prev => ({ ...prev, renderTime }));
    };
  });

  if (!enabled) {
    return null;
  }

  const getMemoryColor = (usage) => {
    if (usage > 80) return 'text-red-600';
    if (usage > 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getStorageColor = (size) => {
    if (size > 4000) return 'text-red-600'; // > 4MB
    if (size > 2000) return 'text-yellow-600'; // > 2MB
    return 'text-green-600';
  };

  return (
    <>
      {/* Botón flotante para mostrar/ocultar */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors"
        title="Performance Monitor"
      >
        📊
      </button>

      {/* Panel de métricas */}
      {isVisible && (
        <div className="fixed bottom-16 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-64">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Performance Monitor</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2 text-xs">
            {/* Memoria */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Memory:</span>
              <span className={`font-mono ${getMemoryColor(metrics.memoryUsage)}`}>
                {metrics.memoryUsage}MB
              </span>
            </div>

            {/* Tiempo de renderizado */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Render:</span>
              <span className={`font-mono ${metrics.renderTime > 16 ? 'text-yellow-600' : 'text-green-600'}`}>
                {metrics.renderTime.toFixed(1)}ms
              </span>
            </div>

            {/* Tiempo de carga */}
            {metrics.loadTime > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Load:</span>
                <span className={`font-mono ${metrics.loadTime > 3000 ? 'text-yellow-600' : 'text-green-600'}`}>
                  {metrics.loadTime.toFixed(0)}ms
                </span>
              </div>
            )}

            {/* Almacenamiento */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Storage:</span>
              <span className={`font-mono ${getStorageColor(metrics.storageSize)}`}>
                {metrics.storageSize}KB ({metrics.storageItems} items)
              </span>
            </div>

            {/* Errores */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Errors:</span>
              <span className={`font-mono ${metrics.errors > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {metrics.errors}
              </span>
            </div>

            {/* Acciones */}
            <div className="pt-2 border-t border-gray-200">
              <div className="flex space-x-2">
                <button
                  onClick={() => performanceUtils.cleanup()}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs transition-colors"
                >
                  Cleanup
                </button>
                <button
                  onClick={() => performanceUtils.checkMemoryUsage()}
                  className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded text-xs transition-colors"
                >
                  Check Memory
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PerformanceMonitor; 