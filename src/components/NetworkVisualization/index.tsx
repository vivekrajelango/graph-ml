import React from 'react';
import Node from './Node';
import Edge from './Edge';
import { GraphData, Node as NodeType } from '../../types/types';

interface NetworkVisualizationProps {
  svgRef: React.MutableRefObject<SVGSVGElement | null>;
  viewBox: { x: number; y: number; width: number; height: number };
  zoom: number;
  setZoom: (zoom: number) => void;
  setViewBox: (viewBox: { x: number; y: number; width: number; height: number }) => void;
  isPanning: boolean;
  isDragging: boolean;
  draggedNode: string | null;
  graphData: GraphData;
  filteredNodes: NodeType[];
  filteredEdges: any[];
  handleSvgMouseDown: (event: React.MouseEvent) => void;
  handleMouseDown: (event: React.MouseEvent, nodeId: string) => void;
  getNodeColor: (type: string) => string;
}

const NetworkVisualization = ({
    svgRef,
  viewBox,
  zoom,
  setZoom,
  setViewBox,
  isPanning,
  isDragging,
  draggedNode,
  graphData,
  filteredNodes,
  filteredEdges,
  handleSvgMouseDown,
  handleMouseDown,
  getNodeColor,
}:NetworkVisualizationProps) => {

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY;
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Calculate new zoom level
    const zoomFactor = delta > 0 ? 1.1 : 0.9;
    const newZoom = Math.min(Math.max(zoom * zoomFactor, 0.1), 5);

    // Calculate mouse position relative to SVG
    const mouseX = ((e.clientX - rect.left) / rect.width) * viewBox.width + viewBox.x;
    const mouseY = ((e.clientY - rect.top) / rect.height) * viewBox.height + viewBox.y;

    // Update viewBox to zoom around the cursor position
    setViewBox({
      x: mouseX - (mouseX - viewBox.x) / zoomFactor,
      y: mouseY - (mouseY - viewBox.y) / zoomFactor,
      width: viewBox.width / zoomFactor,
      height: viewBox.height / zoomFactor
    });

    setZoom(newZoom);
  };

  return (
    <div className="flex-1 relative bg-gradient-to-br from-blue-50 to-indigo-100">
      <svg
        ref={svgRef}
        className="w-full h-[90vh] cursor-crosshair"
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
        style={{ cursor: isPanning ? 'grabbing' : isDragging ? 'grabbing' : 'grab' }}
        onMouseDown={handleSvgMouseDown}
        onWheel={handleWheel}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="#9ca3af"
            />
          </marker>
        </defs>

        <g transform={`scale(${zoom}) translate(${-500 * (zoom - 1) / zoom}, ${-350 * (zoom - 1) / zoom})`}>
          {filteredEdges.map((edge, index) => (
            <Edge
              key={`edge-${index}`}
              edge={edge}
              nodes={graphData.nodes}
            />
          ))}
          
          {filteredNodes.map((node) => (
            <Node
              key={node.id}
              node={node}
              isDragging={isDragging}
              draggedNode={draggedNode}
              handleMouseDown={handleMouseDown}
              getNodeColor={getNodeColor}
            />
          ))}
        </g>
      </svg>
    </div>
  );
};

export default NetworkVisualization;