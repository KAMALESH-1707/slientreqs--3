export interface DroneComponentData {
  id: string;
  number: string;
  name: string;
  subname: string;
  category: 'Structure' | 'Sensors & Vision' | 'Computing & AI' | 'Avionics & Nav' | 'Communication' | 'Propulsion' | 'Power & Signaling';
  role: string;
  whatItDoes: string;
  inResqnet: string;
  inputData: string;
  outputData: string;
  whyItMatters: string;
  // Position coordinates in 3D model space [x, y, z]
  position3D: [number, number, number];
  // Camera focus target offset for optimal inspection
  focusTarget: [number, number, number];
  cameraPosition: [number, number, number];
  // Exploded offset [dx, dy, dz] when exploded view is active
  explodedOffset: [number, number, number];
  colorAccent?: string;
}

export interface DisasterScenarioData {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  challenge: string;
  solution: string;
  workflowStep: string;
  keySensors: string[];
}

export interface SpecItem {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}

export interface SpecCategory {
  title: string;
  items: SpecItem[];
}
