import { GraphData, Node, Edge } from '../types/types';

export const parseGraphML = (xmlString: string): GraphData => {
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