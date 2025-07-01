"use client"
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Sidebar from '../Sidebar';
import SearchBar from '../Header/SearchBar';
import NetworkVisualization from '../NetworkVisualization';
import ProfileDetails from '../ProfileDetails';
import { parseGraphML } from '../../utils/graphMLParser';
import { sampleGraphML } from '@/data/initialData';
import { GraphData, Node, UserProfile } from '../../types/types';
import Header from '../Header';

const sampleProfile: UserProfile = {
  id: "emily-carter",
  name: "Dr. Emily Carter",
  title: "Cardiologist",
  specialty: "Cardiology",
  avatar: "👩‍⚕️",
  peers: 232,
  following: 124,
  patientsServed: 1000,
  successRate: 95,
  about: "Experienced and compassionate doctor specializing in cardiology. Dedicated to providing exceptional patient care and advancing cardiac health through innovative treatments and research.",
  education: {
    institution: "Harvard Medical University",
    degree: "Cardiology Degree",
    specialization: "Specialization in Heart Health",
    period: "Sep 2019 - Jun 2020"
  }
};

const GraphMLComponent= () => {
  // State declarations
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], edges: [] });
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragStartTime, setDragStartTime] = useState(0);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isChecked, setIsChecked] = useState(false);
  const [isMapChecked, setMapChecked] = useState(true);
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, width: 1000, height: 700 });
  const [activeTab, setActiveTab] = useState('network');
  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [showDetails, setShowDetails] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const loggedInUser = {
    name: "Dr. Emily Carter",
    role: "Cardiologist at NHOG",
    avatar: "👩‍⚕️",
    peers: 232,
    following: 124
  };

  useEffect(() => {
    const parsedData = parseGraphML(sampleGraphML);
    setGraphData(parsedData);
  }, []);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith('.graphml')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        try {
          const parsedData = parseGraphML(content);
          setGraphData(parsedData);
        } catch (error) {
          console.error('Error parsing GraphML:', error);
          alert('Error parsing GraphML file. Please check the format.');
        }
      };
      reader.readAsText(file);
    }
  }, []);

  const handleNodeClick = (node: Node) => {
    setSelectedNode(node);
    setShowDetails(true);
  };

  const handleMouseDown = (event: React.MouseEvent, nodeId: string) => {
    event.preventDefault();
    event.stopPropagation();

    const svg = svgRef.current;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const node = graphData.nodes.find(n => n.id === nodeId);
    if (!node) return;

    const svgX = ((event.clientX - rect.left) / rect.width) * 1000;
    const svgY = ((event.clientY - rect.top) / rect.height) * 700;

    setDraggedNode(nodeId);
    setDragStartTime(Date.now());
    setDragStartPos({ x: event.clientX, y: event.clientY });
    setDragOffset({
      x: svgX - node.x,
      y: svgY - node.y
    });
  };

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!draggedNode || !svgRef.current) return;

    const currentTime = Date.now();
    const timeDiff = currentTime - dragStartTime;
    const distance = Math.sqrt(
      Math.pow(event.clientX - dragStartPos.x, 2) +
      Math.pow(event.clientY - dragStartPos.y, 2)
    );

    if (distance > 5 || timeDiff > 100) {
      if (!isDragging) {
        setIsDragging(true);
      }

      const svg = svgRef.current;
      const rect = svg.getBoundingClientRect();
      const svgX = ((event.clientX - rect.left) / rect.width) * 1000;
      const svgY = ((event.clientY - rect.top) / rect.height) * 700;

      const newX = Math.max(30, Math.min(970, svgX - dragOffset.x));
      const newY = Math.max(30, Math.min(670, svgY - dragOffset.y));

      setGraphData(prev => ({
        ...prev,
        nodes: prev.nodes.map(node =>
          node.id === draggedNode
            ? { ...node, x: newX, y: newY }
            : node
        )
      }));
    }
  }, [draggedNode, dragStartTime, dragStartPos, isDragging, dragOffset]);

  const handleMouseUp = useCallback((event: MouseEvent) => {
    const currentTime = Date.now();
    const timeDiff = currentTime - dragStartTime;
    const distance = Math.sqrt(
      Math.pow(event.clientX - dragStartPos.x, 2) +
      Math.pow(event.clientY - dragStartPos.y, 2)
    );

    if (timeDiff < 200 && distance < 5 && draggedNode) {
      const node = graphData.nodes.find(n => n.id === draggedNode);
      if (node) {
        handleNodeClick(node);
      }
    }

    setIsDragging(false);
    setDraggedNode(null);
    setDragOffset({ x: 0, y: 0 });
    setDragStartTime(0);
    setDragStartPos({ x: 0, y: 0 });
  }, [draggedNode, dragStartTime, dragStartPos, graphData.nodes]);

  useEffect(() => {
    if (draggedNode) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedNode, handleMouseMove, handleMouseUp]);

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'Researcher': return 'fill-blue-500';
      case 'Publication': return 'fill-green-500';
      case 'Publisher': return 'fill-purple-500';
      case 'Institution': return 'fill-orange-500';
      default: return 'fill-gray-500';
    }
  };

  const filteredNodes = graphData.nodes.filter(node =>
    node.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEdges = graphData.edges.filter(edge =>
    filteredNodes.some(node => node.id === edge.source) &&
    filteredNodes.some(node => node.id === edge.target)
  );

  const handleSvgMouseDown = (event: React.MouseEvent) => {
    if (event.target === svgRef.current) {
      setIsPanning(true);
      setPanStart({
        x: event.clientX - panOffset.x,
        y: event.clientY - panOffset.y
      });
    }
  };

  const handleSvgMouseMove = useCallback((event: MouseEvent) => {
    if (isPanning) {
      const newX = event.clientX - panStart.x;
      const newY = event.clientY - panStart.y;
      setPanOffset({ x: newX, y: newY });
      setViewBox({
        ...viewBox,
        x: -newX,
        y: -newY
      });
    }
  }, [isPanning, panStart, viewBox]);

  const handleSvgMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  useEffect(() => {
    if (isPanning) {
      document.addEventListener('mousemove', handleSvgMouseMove);
      document.addEventListener('mouseup', handleSvgMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleSvgMouseMove);
        document.removeEventListener('mouseup', handleSvgMouseUp);
      };
    }
  }, [isPanning, handleSvgMouseMove, handleSvgMouseUp]);

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden relative">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        loggedInUser={loggedInUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleFileUpload={handleFileUpload}
        isChecked={isChecked}
        setIsChecked={setIsChecked}
        isMapChecked={isMapChecked}
        setMapChecked={setMapChecked}
      />

      {showDetails && (
        <ProfileDetails
          selectedNode={selectedNode}
          sampleProfile={sampleProfile}
          onClose={() => setShowDetails(false)}
        />
      )}

      <div className="flex-1 flex flex-col lg:ml-0 ml-0">
        <Header
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          loggedInUser={loggedInUser}
          isChecked={isChecked}
          setIsChecked={setIsChecked}
          isMapChecked={isMapChecked}
          setMapChecked={setMapChecked}
        />

        <NetworkVisualization
          svgRef={svgRef as React.RefObject<SVGSVGElement>}
          viewBox={viewBox}
          zoom={zoom}
          setZoom={setZoom}
          setViewBox={setViewBox}
          isPanning={isPanning}
          isDragging={isDragging}
          draggedNode={draggedNode}
          graphData={graphData}
          filteredNodes={filteredNodes}
          filteredEdges={filteredEdges}
          handleSvgMouseDown={handleSvgMouseDown}
          handleMouseDown={handleMouseDown}
          getNodeColor={getNodeColor}
        />
      </div>

      
    </div>
  );
};

export default GraphMLComponent;