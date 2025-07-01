import React from 'react';
import { Edge as EdgeType, Node } from '../../types/types';

interface EdgeProps {
  edge: EdgeType;
  nodes: Node[];
}

const Edge= ({ edge, nodes }:EdgeProps) => {
  const sourceNode = nodes.find(n => n.id === edge.source);
  const targetNode = nodes.find(n => n.id === edge.target);

  if (!sourceNode || !targetNode) return null;

  return (
    <line
      x1={sourceNode.x}
      y1={sourceNode.y}
      x2={targetNode.x}
      y2={targetNode.y}
      stroke="#9ca3af"
      strokeWidth="2"
      opacity="0.6"
      markerEnd="url(#arrowhead)"
    />
  );
};

export default Edge;