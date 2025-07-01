import React from 'react';
import { Node as NodeType } from '../../types/types';

interface NodeProps {
  node: NodeType;
  isDragging: boolean;
  draggedNode: string | null;
  handleMouseDown: (event: React.MouseEvent, nodeId: string) => void;
  getNodeColor: (type: string) => string;
}

const Node= ({
  node,
  isDragging,
  draggedNode,
  handleMouseDown,
  getNodeColor
}:NodeProps) => {
  return (
    <g key={node.id}>
      <circle
        cx={node.x}
        cy={node.y}
        r="28"
        className={`${getNodeColor(node.type)} cursor-pointer hover:opacity-90 transition-all duration-200 ${
          draggedNode === node.id ? 'drop-shadow-lg scale-100' : 'hover:scale-100'
        }`}
        onMouseDown={(e) => handleMouseDown(e, node.id)}
        stroke="white"
        strokeWidth="3"
        style={{ cursor: isDragging && draggedNode === node.id ? 'grabbing' : 'grab' }}
      />
      <text
        x={node.x}
        y={node.y}
        textAnchor="middle"
        dy="0.35em"
        className="fill-white text-lg font-medium pointer-events-none select-none"
      >
        {node.avatar}
      </text>
      <text
        x={node.x}
        y={node.y + 45}
        textAnchor="middle"
        className="fill-gray-700 text-sm font-medium pointer-events-none select-none"
      >
        {node.label.length > 12 ? node.label.substring(0, 12) + '...' : node.label}
      </text>
      {node.connections > 0 && (
        <g>
          <circle
            cx={node.x + 20}
            cy={node.y - 20}
            r="10"
            fill="#ef4444"
            stroke="white"
            strokeWidth="2"
          />
          <text
            x={node.x + 20}
            y={node.y - 20}
            textAnchor="middle"
            dy="0.35em"
            className="fill-white text-xs font-bold pointer-events-none select-none"
          >
            {node.connections}
          </text>
        </g>
      )}
    </g>
  );
};

export default Node;