export interface Node {
  id: string;
  label: string;
  type: string;
  x: number;
  y: number;
  connections: number;
  avatar?: string;
}

export interface Edge {
  source: string;
  target: string;
  label?: string;
}

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

export interface UserProfile {
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

export interface LoggedInUser {
  name: string;
  role: string;
  avatar: string;
  peers: number;
  following: number;
}