/**
 * Utility to apply hierarchical layout to nodes using Dagre
 * Organizes nodes in a top-down (hierarchical) structure
 */

import Dagre from '@dagrejs/dagre';

/**
 * Calculate positions for nodes using Dagre layout algorithm
 * @param {Array} nodes - React Flow nodes
 * @param {Array} edges - React Flow edges
 * @returns {Array} Nodes with calculated positions
 */
export const getLayoutedNodes = (nodes, edges) => {
  // Create a Dagre graph
  const dagreGraph = new Dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  // Graph configuration for top-down hierarchical layout
  dagreGraph.setGraph({
    rankdir: 'TB',           // Top-to-Bottom
    ranksep: 150,            // Vertical spacing between ranks
    nodesep: 80,             // Horizontal spacing between nodes
    compound: true,
    align: 'DL'              // Align to Down-Left
  });

  // Add nodes to Dagre
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: 180,
      height: 80,
    });
  });

  // Add edges to Dagre
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Compute layout
  Dagre.layout(dagreGraph);

  // Apply computed positions to nodes
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - 90,  // Center the node (width/2)
        y: nodeWithPosition.y - 40,  // Center the node (height/2)
      },
    };
  });

  return layoutedNodes;
};

/**
 * Get color for node based on its type
 * @param {String} nodeType - Type of node (title, concept, topic, resource, etc.)
 * @returns {String} Color code
 */
export const getNodeColor = (nodeType) => {
  const colorMap = {
    'title': '#4f46e5',        // Indigo - Main topic
    'concept': '#0891b2',      // Cyan - Intermediate
    'topic': '#059669',        // Green - Subtopic
    'resource': '#ca8a04',     // Amber - Resource
    'todo': '#dc2626',         // Red - Todo
    'default': '#ffffff',      // White - Default
  };
  
  return colorMap[nodeType] || colorMap['default'];
};

/**
 * Style node based on its properties and selection state
 * @param {Object} node - React Flow node
 * @param {String} selectedNodeId - ID of currently selected node
 * @returns {Object} Style object for the node
 */
export const getNodeStyle = (node, selectedNodeId) => {
  const isSelected = node.id === selectedNodeId;
  const nodeType = node.data?.nodeType || 'default';
  const bgColor = getNodeColor(nodeType);

  return {
    backgroundColor: bgColor,
    border: isSelected 
      ? '3px solid #ff6b6b'    // Red border when selected
      : '2px solid #e5e7eb',   // Gray border when not selected
    borderRadius: '8px',
    padding: '8px',
    fontSize: '13px',
    fontWeight: nodeType === 'title' ? '700' : '600',
    color: nodeType === 'title' || nodeType === 'concept' ? '#ffffff' : '#000000',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: isSelected 
      ? '0 0 0 3px rgba(255, 107, 107, 0.1), 0 4px 12px rgba(0, 0, 0, 0.15)'
      : '0 2px 4px rgba(0, 0, 0, 0.1)',
  };
};
