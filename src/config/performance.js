// Configuración de optimizaciones de rendimiento
export const performanceConfig = {
  // Configuración de React Flow
  reactFlow: {
    // Throttle para fitView (ms)
    fitViewThrottle: 100,
    
    // Intervalo para detectar conexiones activas (ms)
    connectionCheckInterval: 100,
    
    // Tamaño máximo de nodos antes de aplicar virtualización
    maxNodesForVirtualization: 1000,
    
    // Tamaño máximo de edges antes de aplicar optimizaciones
    maxEdgesForOptimization: 500,
    
    // Habilitar lazy loading de nodos
    enableLazyLoading: true,
    
    // Tamaño del viewport para lazy loading
    lazyLoadingViewportSize: 1000,
  },

  // Configuración de almacenamiento local
  localStorage: {
    // Tamaño máximo de datos en localStorage (bytes)
    maxStorageSize: 5 * 1024 * 1024, // 5MB
    
    // Tiempo de expiración para datos antiguos (días)
    dataExpirationDays: 30,
    
    // Comprimir datos antes de guardar
    enableCompression: true,
    
    // Verificar integridad de datos
    enableIntegrityCheck: true,
  },

  // Configuración de caché
  cache: {
    // Tiempo de vida del caché (ms)
    ttl: 5 * 60 * 1000, // 5 minutos
    
    // Tamaño máximo del caché
    maxSize: 100,
    
    // Habilitar caché en memoria
    enableMemoryCache: true,
    
    // Habilitar caché en localStorage
    enableLocalStorageCache: true,
  },

  // Configuración de red
  network: {
    // Timeout para peticiones (ms)
    requestTimeout: 10000,
    
    // Número máximo de reintentos
    maxRetries: 3,
    
    // Delay entre reintentos (ms)
    retryDelay: 1000,
    
    // Habilitar caché de peticiones
    enableRequestCache: true,
  },

  // Configuración de renderizado
  rendering: {
    // Habilitar memoización de componentes
    enableMemoization: true,
    
    // Habilitar lazy loading de componentes
    enableLazyComponents: true,
    
    // Tamaño del chunk para lazy loading
    lazyChunkSize: 100,
    
    // Habilitar virtualización de listas
    enableVirtualization: true,
    
    // Tamaño del viewport para virtualización
    virtualizationViewportSize: 500,
  },

  // Configuración de monitoreo
  monitoring: {
    // Habilitar métricas de rendimiento
    enablePerformanceMetrics: true,
    
    // Intervalo de reporte de métricas (ms)
    metricsReportInterval: 30000, // 30 segundos
    
    // Habilitar logging de errores
    enableErrorLogging: true,
    
    // Habilitar tracking de eventos
    enableEventTracking: false,
  },

  // Configuración de optimizaciones específicas
  optimizations: {
    // Habilitar debounce en búsquedas
    enableSearchDebounce: true,
    
    // Delay para debounce (ms)
    debounceDelay: 300,
    
    // Habilitar throttling en scroll
    enableScrollThrottling: true,
    
    // Throttle para scroll (ms)
    scrollThrottle: 16, // ~60fps
    
    // Habilitar optimización de imágenes
    enableImageOptimization: true,
    
    // Habilitar preloading de recursos críticos
    enableCriticalResourcePreloading: true,
  },

  // Configuración de desarrollo
  development: {
    // Habilitar warnings de rendimiento
    enablePerformanceWarnings: true,
    
    // Habilitar profiling
    enableProfiling: false,
    
    // Habilitar debug de re-renders
    enableRenderDebug: false,
    
    // Habilitar medición de tiempo de carga
    enableLoadTimeMeasurement: true,
  }
};

// Funciones de utilidad para optimizaciones
export const performanceUtils = {
  // Debounce function
  debounce: (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  },

  // Throttle function
  throttle: (func, delay) => {
    let lastCall = 0;
    return (...args) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func.apply(null, args);
      }
    };
  },

  // Memoize function
  memoize: (func) => {
    const cache = new Map();
    return (...args) => {
      const key = JSON.stringify(args);
      if (cache.has(key)) {
        return cache.get(key);
      }
      const result = func.apply(null, args);
      cache.set(key, result);
      return result;
    };
  },

  // Lazy load function
  lazyLoad: (importFunc) => {
    return React.lazy(importFunc);
  },

  // Performance measurement
  measurePerformance: (name, fn) => {
    if (performanceConfig.monitoring.enablePerformanceMetrics) {
      const start = performance.now();
      const result = fn();
      const end = performance.now();
      console.log(`${name} took ${end - start}ms`);
      return result;
    }
    return fn();
  },

  // Memory usage check
  checkMemoryUsage: () => {
    if ('memory' in performance) {
      const memory = performance.memory;
      const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
      const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024);
      const limitMB = Math.round(memory.jsHeapSizeLimit / 1024 / 1024);
      
      console.log(`Memory usage: ${usedMB}MB / ${totalMB}MB (limit: ${limitMB}MB)`);
      
      // Warning si el uso de memoria es alto
      if (usedMB / limitMB > 0.8) {
        console.warn('High memory usage detected!');
      }
    }
  },

  // Cleanup function
  cleanup: () => {
    // Limpiar cachés
    if (typeof window !== 'undefined') {
      // Limpiar localStorage si es necesario
      const stats = performanceUtils.getStorageStats();
      if (stats.totalSize > performanceConfig.localStorage.maxStorageSize) {
        performanceUtils.cleanupOldData();
      }
    }
  },

  // Get storage statistics
  getStorageStats: () => {
    if (typeof window === 'undefined') return { totalSize: 0, items: 0 };
    
    let totalSize = 0;
    let items = 0;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      if (value) {
        totalSize += value.length;
        items++;
      }
    }
    
    return { totalSize, items };
  },

  // Cleanup old data
  cleanupOldData: () => {
    if (typeof window === 'undefined') return;
    
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() - performanceConfig.localStorage.dataExpirationDays);
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('roadmap_')) {
        try {
          const value = localStorage.getItem(key);
          const data = JSON.parse(value);
          
          if (data.lastModified && new Date(data.lastModified) < expirationDate) {
            localStorage.removeItem(key);
            console.log(`Cleaned up old data: ${key}`);
          }
        } catch (error) {
          // Eliminar datos corruptos
          localStorage.removeItem(key);
          console.log(`Cleaned up corrupted data: ${key}`);
        }
      }
    }
  }
};

export default performanceConfig; 