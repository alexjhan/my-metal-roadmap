import { useCallback, useRef, useEffect } from 'react';
import { useReactFlow } from 'reactflow';

export const useReactFlowOptimized = () => {
  const { fitView, getNodes, getEdges, setNodes, setEdges } = useReactFlow();
  const lastFitViewTime = useRef(0);
  const fitViewTimeoutRef = useRef(null);

  // Función optimizada para fitView con throttling
  const optimizedFitView = useCallback((options = {}) => {
    const now = Date.now();
    const throttleDelay = 100; // 100ms throttle

    if (now - lastFitViewTime.current < throttleDelay) {
      // Si se llama muy rápido, programar para más tarde
      if (fitViewTimeoutRef.current) {
        clearTimeout(fitViewTimeoutRef.current);
      }
      
      fitViewTimeoutRef.current = setTimeout(() => {
        fitView(options);
        lastFitViewTime.current = Date.now();
      }, throttleDelay);
      
      return;
    }

    fitView(options);
    lastFitViewTime.current = now;
  }, [fitView]);

  // Función optimizada para actualizar nodos
  const optimizedSetNodes = useCallback((updater) => {
    const currentNodes = getNodes();
    const newNodes = typeof updater === 'function' ? updater(currentNodes) : updater;
    
    // Verificar si realmente hay cambios antes de actualizar
    const hasChanges = newNodes.some((newNode, index) => {
      const currentNode = currentNodes[index];
      if (!currentNode) return true;
      
      return (
        newNode.position.x !== currentNode.position.x ||
        newNode.position.y !== currentNode.position.y ||
        newNode.data?.label !== currentNode.data?.label ||
        JSON.stringify(newNode.data) !== JSON.stringify(currentNode.data)
      );
    });

    if (hasChanges) {
      setNodes(newNodes);
    }
  }, [getNodes, setNodes]);

  // Función optimizada para actualizar edges
  const optimizedSetEdges = useCallback((updater) => {
    const currentEdges = getEdges();
    const newEdges = typeof updater === 'function' ? updater(currentEdges) : updater;
    
    // Verificar si realmente hay cambios antes de actualizar
    const hasChanges = newEdges.some((newEdge, index) => {
      const currentEdge = currentEdges[index];
      if (!currentEdge) return true;
      
      return (
        newEdge.source !== currentEdge.source ||
        newEdge.target !== currentEdge.target ||
        newEdge.type !== currentEdge.type ||
        JSON.stringify(newEdge.style) !== JSON.stringify(currentEdge.style)
      );
    });

    if (hasChanges) {
      setEdges(newEdges);
    }
  }, [getEdges, setEdges]);

  // Función para centrar en un nodo específico
  const centerOnNode = useCallback((nodeId, options = {}) => {
    const nodes = getNodes();
    const targetNode = nodes.find(node => node.id === nodeId);
    
    if (targetNode) {
      optimizedFitView({
        ...options,
        nodes: [targetNode],
        padding: options.padding || 0.2
      });
    }
  }, [getNodes, optimizedFitView]);

  // Función para centrar en múltiples nodos
  const centerOnNodes = useCallback((nodeIds, options = {}) => {
    const nodes = getNodes();
    const targetNodes = nodes.filter(node => nodeIds.includes(node.id));
    
    if (targetNodes.length > 0) {
      optimizedFitView({
        ...options,
        nodes: targetNodes,
        padding: options.padding || 0.2
      });
    }
  }, [getNodes, optimizedFitView]);

  // Función para obtener el área visible
  const getVisibleArea = useCallback(() => {
    const nodes = getNodes();
    if (nodes.length === 0) return null;

    const positions = nodes.map(node => node.position);
    const minX = Math.min(...positions.map(p => p.x));
    const maxX = Math.max(...positions.map(p => p.x));
    const minY = Math.min(...positions.map(p => p.y));
    const maxY = Math.max(...positions.map(p => p.y));

    return {
      minX,
      maxX,
      minY,
      maxY,
      width: maxX - minX,
      height: maxY - minY,
      center: {
        x: (minX + maxX) / 2,
        y: (minY + maxY) / 2
      }
    };
  }, [getNodes]);

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (fitViewTimeoutRef.current) {
        clearTimeout(fitViewTimeoutRef.current);
      }
    };
  }, []);

  return {
    optimizedFitView,
    optimizedSetNodes,
    optimizedSetEdges,
    centerOnNode,
    centerOnNodes,
    getVisibleArea,
    getNodes,
    getEdges
  };
};

export default useReactFlowOptimized; 