import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Filter, Users, BookOpen, Building, Award, MapPin, MessageCircle, Bell, Settings, Menu, X } from 'lucide-react';

// Types
interface Node {
  id: string;
  label: string;
  type: string;
  x: number;
  y: number;
  connections: number;
  avatar?: string;
}

interface Edge {
  source: string;
  target: string;
  label?: string;
}

interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

interface UserProfile {
  id: string;
  name: string;
  title: string;
  specialty: string;
  avatar: string;
  peers: number;
  following: number;
  patientsServed: number;
  successRate: number;
  about: string;
  education: {
    institution: string;
    degree: string;
    specialization: string;
    period: string;
  };
}

// Sample data
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

// GraphML Parser
const parseGraphML = (xmlString: string): GraphData => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
  
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  // Parse nodes
  const nodeElements = xmlDoc.querySelectorAll('node');
  nodeElements.forEach((nodeEl, index) => {
    const id = nodeEl.getAttribute('id') || `node-${index}`;
    const labelEl = nodeEl.querySelector('data[key="labels"]');
    const label = labelEl?.textContent || 'Unknown';
    
    // Extract type from label or id
    let type = 'Researcher';
    if (label.includes('BookPublication') || id.includes('BookPublication')) type = 'Publication';
    else if (label.includes('Publisher') || id.includes('Publisher')) type = 'Publisher';
    else if (label.includes('Institution') || id.includes('Institution')) type = 'Institution';
    
    nodes.push({
      id,
      label: id.includes('0000-') ? `Researcher ${index + 1}` : label,
      type,
      x: Math.random() * 800 + 100,
      y: Math.random() * 600 + 100,
      connections: 0,
      avatar: type === 'Researcher' ? '👨‍⚕️' : type === 'Publication' ? '📚' : '🏢'
    });
  });
  
  // Parse edges
  const edgeElements = xmlDoc.querySelectorAll('edge');
  edgeElements.forEach((edgeEl) => {
    const source = edgeEl.getAttribute('source');
    const target = edgeEl.getAttribute('target');
    const labelEl = edgeEl.querySelector('data[key="labels"]');
    
    if (source && target) {
      edges.push({
        source,
        target,
        label: labelEl?.textContent || undefined
      });
    }
  });
  
  // Calculate connections
  nodes.forEach(node => {
    node.connections = edges.filter(edge => 
      edge.source === node.id || edge.target === node.id
    ).length;
  });
  
  return { nodes, edges };
};

// Sample GraphML data
const sampleGraphML = `<?xml version='1.0' encoding='utf-8'?>
<graphml xmlns="http://graphml.graphdrawing.org/xmlns" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://graphml.graphdrawing.org/xmlns http://graphml.graphdrawing.org/xmlns/1.0/graphml.xsd">
<key id="labels" for="edge" attr.name="labels" attr.type="string"/>
<key id="labels" for="node" attr.name="labels" attr.type="string"/>
<graph edgedefault="directed">
<node id="researcher-1"><data key="labels">Researcher</data></node>
<node id="researcher-2"><data key="labels">Researcher</data></node>
<node id="researcher-3"><data key="labels">Researcher</data></node>
<node id="researcher-4"><data key="labels">Researcher</data></node>
<node id="researcher-5"><data key="labels">Researcher</data></node>
<node id="researcher-6"><data key="labels">Researcher</data></node>
<node id="researcher-7"><data key="labels">Researcher</data></node>
<node id="researcher-8"><data key="labels">Researcher</data></node>
<node id="pub-1"><data key="labels">BookPublication</data></node>
<node id="pub-2"><data key="labels">BookPublication</data></node>
<node id="pub-3"><data key="labels">BookPublication</data></node>
<node id="publisher-1"><data key="labels">Publisher</data></node>
<node id="institution-1"><data key="labels">Institution</data></node>
<edge source="researcher-1" target="researcher-2"/>
<edge source="researcher-1" target="researcher-3"/>
<edge source="researcher-2" target="researcher-4"/>
<edge source="researcher-3" target="researcher-5"/>
<edge source="researcher-4" target="researcher-6"/>
<edge source="researcher-5" target="researcher-7"/>
<edge source="researcher-6" target="researcher-8"/>
<edge source="researcher-1" target="pub-1"/>
<edge source="researcher-2" target="pub-2"/>
<edge source="researcher-3" target="pub-3"/>
<edge source="pub-1" target="publisher-1"/>
<edge source="pub-2" target="publisher-1"/>
<edge source="researcher-1" target="institution-1"/>
<edge source="researcher-2" target="institution-1"/>
<edge source="researcher-7" target="researcher-1"/>
<edge source="researcher-8" target="researcher-4"/>
</graph>
</graphml>`;

const GraphMLComponent: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], edges: [] });
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showConnections, setShowConnections] = useState(true);
  const [showConnectionsOnMap, setShowConnectionsOnMap] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragStartTime, setDragStartTime] = useState(0);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Parse sample GraphML data on mount
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
    // Only handle click if we're not in the middle of a drag operation
    setSelectedNode(node);
    setSidebarOpen(true);
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

    // Only start dragging if mouse moved more than 5px or held for more than 100ms
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

    // If it was a quick click (less than 200ms and less than 5px movement), treat as click
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

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-lg flex flex-col">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">PS</span>
              </div>
              <div>
                <h1 className="font-bold text-xl text-gray-900">PeerSpace</h1>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
              {sampleProfile.avatar}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{sampleProfile.name}</h2>
              <p className="text-sm text-gray-600">{sampleProfile.title} at NHOG</p>
            </div>
          </div>
          
          <div className="flex gap-2 mb-4">
            <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
              Create web
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">My Peers</span>
              <span className="font-semibold text-gray-900">{sampleProfile.peers}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showConnections}
                onChange={(e) => setShowConnections(e.target.checked)}
                className="rounded"
              />
              <span>Show connections</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showConnectionsOnMap}
                onChange={(e) => setShowConnectionsOnMap(e.target.checked)}
                className="rounded"
              />
              <span>Show my connections on map</span>
            </label>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-100 rounded-lg">
            <Search className="w-5 h-5 text-gray-500" />
            <span>Search</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-100 rounded-lg">
            <Users className="w-5 h-5 text-gray-500" />
            <span>Network</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-100 rounded-lg">
            <BookOpen className="w-5 h-5 text-gray-500" />
            <span>Publications</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-100 rounded-lg">
            <Bell className="w-5 h-5 text-gray-500" />
            <span>Notifications</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-100 rounded-lg">
            <MessageCircle className="w-5 h-5 text-gray-500" />
            <span>Messages</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-100 rounded-lg">
            <Settings className="w-5 h-5 text-gray-500" />
            <span>Settings</span>
          </button>
        </nav>

        {/* Upload Section */}
        <div className="p-4 border-t">
          <label className="block w-full">
            <input
              type="file"
              accept=".graphml"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="w-full bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50">
              <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Upload GraphML File</p>
            </div>
          </label>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Following</span>
            <span className="font-semibold">{sampleProfile.following}</span>
          </div>
        </div>

        {/* Network Visualization */}
        <div className="flex-1 relative bg-gradient-to-br from-blue-50 to-indigo-100">
          <svg
            ref={svgRef}
            className="w-full h-full cursor-crosshair"
            viewBox="0 0 1000 700"
            style={{ cursor: isDragging ? 'grabbing' : 'default' }}
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

            {/* Render edges */}
            {showConnectionsOnMap && graphData.edges.map((edge, index) => {
              const sourceNode = graphData.nodes.find(n => n.id === edge.source);
              const targetNode = graphData.nodes.find(n => n.id === edge.target);
              
              if (!sourceNode || !targetNode) return null;
              
              return (
                <line
                  key={`edge-${index}`}
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
            })}
            
            {/* Render nodes */}
            {filteredNodes.map((node) => (
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
                {/* Node label */}
                <text
                  x={node.x}
                  y={node.y + 45}
                  textAnchor="middle"
                  className="fill-gray-700 text-sm font-medium pointer-events-none select-none"
                >
                  {node.label.length > 12 ? node.label.substring(0, 12) + '...' : node.label}
                </text>
                {/* Connection count badge */}
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
            ))}
          </svg>
        </div>
      </div>

      {/* Profile Panel */}
      {selectedNode && sidebarOpen && (
        <div className="w-80 bg-white shadow-lg border-l">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Profile Details</h3>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                {selectedNode.avatar}
              </div>
              <h4 className="font-semibold text-gray-900">{selectedNode.label}</h4>
              <p className="text-sm text-gray-600">{selectedNode.type}</p>
              <p className="text-xs text-gray-500 mt-1">
                Connections: {selectedNode.connections}
              </p>
            </div>

            <div className="space-y-4">
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                View Profile
              </button>
              <button className="w-full border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
                Resume
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Users className="w-4 h-4" />
                  <span className="text-xs">Connections</span>
                </div>
                <div className="font-bold text-lg">{selectedNode.connections}</div>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Award className="w-4 h-4" />
                  <span className="text-xs">Success rate</span>
                </div>
                <div className="font-bold text-lg">--</div>
              </div>
            </div>

            <div className="mt-6">
              <h5 className="font-medium mb-2">About</h5>
              <p className="text-sm text-gray-600">
                {selectedNode.type} node in the network. Click to explore connections and relationships.
              </p>
            </div>

            <div className="mt-6">
              <h5 className="font-medium mb-2">Type</h5>
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <div className="w-4 h-4 bg-blue-600 rounded"></div>
                <div>
                  <div className="font-medium text-sm">{selectedNode.type}</div>
                  <div className="text-xs text-gray-600">Network Entity</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphMLComponent;