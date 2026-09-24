import { DisasterScenarioData } from '../types';

export const DISASTER_SCENARIOS: DisasterScenarioData[] = [
  {
    id: 'earthquake',
    title: 'Earthquake',
    subtitle: 'Collapsed structures, pulverized masonry & trapped victims under voids',
    iconName: 'Activity',
    challenge: 'Roadways are pulverized, power and cell towers are destroyed, and unstable voids risk collapse under human responder foot traffic.',
    solution: 'RQ-01 hovers low over crushed concrete piles. The FLIR Lepton 3.5 thermal camera detects body heat rising through air gaps while YOLO11n identifies waving hands or clothing, transmitting GPS coordinates over LoRa.',
    workflowStep: 'Rapid aerial grid search → Void thermal scan → Survivor lock → Sound audio buzzer → LoRa SOS packet to base station',
    keySensors: ['FLIR Lepton 3.5 Thermal', 'YOLO11n Edge AI', 'SX1262 LoRa', 'Audio Buzzer']
  },
  {
    id: 'flood',
    title: 'Flood',
    subtitle: 'Inundated plains, submerged landmarks & cut-off rooftop survivors',
    iconName: 'Waves',
    challenge: 'Rapid flood currents isolate rooftops, trees, and floating debris where rescue boats cannot safely navigate in torrential darkness.',
    solution: 'With IP43 rain resistance and high-gain LoRa reaching 15-20 km, RQ-01 surveys miles of flood basin, identifies stranded people on roofs or vehicles, and relays exact coordinates to evacuation dinghies.',
    workflowStep: 'Long-range river corridor sweep → Dual RGB/Thermal human detection → GPS fix → Waterflow obstacle assessment → LoRa beaconing',
    keySensors: ['High-Res RGB Camera', 'LoRa 15-20 km Link', 'Multi-GNSS Fix', 'Safety Orange Hull']
  },
  {
    id: 'landslide',
    title: 'Landslide',
    subtitle: 'Unstable muddy terrain, blocked mountain passes & active soil movement',
    iconName: 'Mountain',
    challenge: 'Secondary mudslides threaten ground responders; mud cover renders standard visual identification nearly impossible.',
    solution: 'The drone flies safe autonomous perimeter routes without risking rescue workers on active mudslides. Thermal signatures highlight living beings before hypothermia sets in.',
    workflowStep: 'Terrain elevation contour survey → Thermal contrast differential → Survivor boundary tagging → Lower-risk access path advice',
    keySensors: ['Thermal Sensor Fusion', '6-DOF IMU Stability', 'Obstacle Sensors', 'Autonomous Flight']
  },
  {
    id: 'cyclone',
    title: 'Cyclone',
    subtitle: 'Extreme wind gusts, torrential rain & severe debris displacement',
    iconName: 'Wind',
    challenge: 'Gale-force winds, flying debris, and total telecommunication blackout paralyze emergency response coordination.',
    solution: 'Designed to withstand 10 m/s winds with high-torque brushless motors, RQ-01 deploys immediately in the storm aftermath before road clearing begins, using offline edge AI.',
    workflowStep: 'Storm aftermath rapid deploy → Offline Jetson processing → High-wind hover hold → LoRa packet broadcast over severed infrastructure',
    keySensors: ['Brushless Propulsion', 'Jetson Orin Nano (Offline)', 'LoRa E22 RF', 'IP43 Sealing']
  },
  {
    id: 'building-collapse',
    title: 'Building Collapse',
    subtitle: 'Confined commercial complexes, dangling rebar & zero-visibility dust',
    iconName: 'Building2',
    challenge: 'Heavy dust coats camera lenses, toxic gas risks, and claustrophobic interior corridors prevent human entry.',
    solution: 'Front and downward obstacle avoidance sensors navigate narrow crevices while high-intensity red/blue LEDs illuminate interior rubble. Audio buzzer reassures trapped victims.',
    workflowStep: 'Crevice insertion → ToF obstacle avoidance → Dual sensor night vision → AI human confirmation → Audio buzzer reassurance',
    keySensors: ['Front/Down Obstacle Sensors', 'Dual Camera Pod', 'Status & Lighting LEDs', 'Audio Alert Buzzer']
  }
];
