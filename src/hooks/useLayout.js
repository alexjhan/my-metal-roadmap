import { useEffect, useCallback } from 'react';

const NODE_WIDTH = 180;
const NODE_HEIGHT = 90;
const NODE_WIDTH_MOBILE = 140;
const NODE_HEIGHT_MOBILE = 80;

const useLayout = (nodes, edges, setNodes) => {
  const getLayoutedElements = useCallback(() => {
    // Layout radial personalizado
    const centerNode = nodes.find(node => node.id === 'termodinamica');
    if (!centerNode) return nodes;

    // Detectar si estamos en móvil
    const isMobile = window.innerWidth < 768;
    const nodeWidth = isMobile ? NODE_WIDTH_MOBILE : NODE_WIDTH;
    const nodeHeight = isMobile ? NODE_HEIGHT_MOBILE : NODE_HEIGHT;
    const radius = isMobile ? 200 : 300;

    const centerX = isMobile ? 300 : 500;
    const centerY = isMobile ? 250 : 400;

    // Posicionar nodo central
    const layoutedNodes = nodes.map((node) => {
      if (node.id === 'termodinamica') {
        return {
          ...node,
          position: { x: centerX - nodeWidth / 2, y: centerY - nodeHeight / 2 }
        };
      }

      // Encontrar el índice del nodo para distribución radial
      const nodeIndex = nodes.findIndex(n => n.id === node.id);
      const angle = (nodeIndex * 2 * Math.PI) / (nodes.length - 1);
      
      // Distribuir nodos en círculo alrededor del centro
      const x = centerX + radius * Math.cos(angle) - nodeWidth / 2;
      const y = centerY + radius * Math.sin(angle) - nodeHeight / 2;

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