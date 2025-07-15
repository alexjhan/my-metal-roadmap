import { useEffect, useCallback, useRef } from 'react';

const useLayout = (nodes, edges, setNodes) => {
  const prevNodesLengthRef = useRef(0);
  const prevEdgesLengthRef = useRef(0);

  const getLayoutedElements = useCallback(() => {
    // Solo aplicar layout si realmente hay cambios significativos
    if (nodes.length === 0) return nodes;
    
    return nodes.map((node) => ({
      ...node,
      position: { ...node.position }
    }));
  }, [nodes]);

  useEffect(() => {
    // Evitar re-renders innecesarios comparando longitudes
    const nodesLengthChanged = prevNodesLengthRef.current !== nodes.length;
    const edgesLengthChanged = prevEdgesLengthRef.current !== edges.length;
    
    // Solo aplicar layout si hay cambios reales
    if ((nodesLengthChanged || edgesLengthChanged) && nodes.length > 0) {
      const layoutedNodes = getLayoutedElements();
      
      // Verificar si realmente hay cambios antes de actualizar
      const hasChanges = layoutedNodes.some((node, index) => {
        const originalNode = nodes[index];
        return (
          node.position.x !== originalNode.position.x ||
          node.position.y !== originalNode.position.y
        );
      });
      
      if (hasChanges) {
        setNodes(layoutedNodes);
      }
      
      // Actualizar referencias
      prevNodesLengthRef.current = nodes.length;
      prevEdgesLengthRef.current = edges.length;
    }
  }, [nodes.length, edges.length, getLayoutedElements, setNodes]);

  return { getLayoutedElements };
};

export default useLayout; 