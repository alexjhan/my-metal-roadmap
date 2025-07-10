import { useEffect, useCallback } from 'react';

const NODE_WIDTH = 180;
const NODE_HEIGHT = 90;

const useLayout = (nodes, edges, setNodes) => {
  const getLayoutedElements = useCallback(() => {
    // Layout radial personalizado
    const centerNode = nodes.find(node => node.id === 'termodinamica');
    if (!centerNode) return nodes;

    const centerX = 500;
    const centerY = 400;
    const radius = 300;

    // Posicionar nodo central
    const layoutedNodes = nodes.map((node) => {
      if (node.id === 'termodinamica') {
        return {
          ...node,
          position: { x: centerX - NODE_WIDTH / 2, y: centerY - NODE_HEIGHT / 2 }
        };
      }

      // Encontrar el índice del nodo para distribución radial
      const nodeIndex = nodes.findIndex(n => n.id === node.id);
      const angle = (nodeIndex * 2 * Math.PI) / (nodes.length - 1);
      
      // Distribuir nodos en círculo alrededor del centro
      const x = centerX + radius * Math.cos(angle) - NODE_WIDTH / 2;
      const y = centerY + radius * Math.sin(angle) - NODE_HEIGHT / 2;

      return {
        ...node,
        position: { x, y }
      };
    });

    return layoutedNodes;
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