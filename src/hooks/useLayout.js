import { useEffect, useCallback } from 'react';

const useLayout = (nodes, edges, setNodes) => {
  const getLayoutedElements = useCallback(() => {
    // Mantener las posiciones originales de los nodos sin modificaciones
    return nodes.map((node) => ({
      ...node,
      position: { ...node.position }
    }));
  }, [nodes, edges]);

  useEffect(() => {
    if (nodes.length > 0 && edges.length > 0) {
      const layoutedNodes = getLayoutedElements();
      setNodes(layoutedNodes);
    }
  }, [nodes.length, edges.length, getLayoutedElements, setNodes]);

  return { getLayoutedElements };
};

export default useLayout; 