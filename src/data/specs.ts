import { SpecCategory } from '../types';

export const SPEC_CATEGORIES: SpecCategory[] = [
  {
    title: 'Physical & Airframe',
    items: [
      { label: 'Frame Configuration', value: 'Hybrid VTOL Fixed-Wing (4 Lift + 1 Cruise)', highlight: true },
      { label: 'Dimensions (Span × L × H)', value: '1,400 mm Wingspan × 920 mm × 220 mm' },
      { label: 'Operating Weight', value: '~ 4.2 kg (Including 6S 16Ah Battery Pack)' },
      { label: 'Max Payload Capacity', value: '~ 1.2 kg (Gimbal Turret + Avionics)' },
      { label: 'Ingress Protection', value: 'IP54 (Rain, Dust & Smoke Resistant)', highlight: true },
      { label: 'Primary Construction', value: 'Matte Charcoal Carbon Fiber (#1a1a1c, R:0.3, M:0.8) + Aero Composite' }
    ]
  },
  {
    title: 'Flight Performance & Dynamics',
    items: [
      { label: 'Cruise Velocity (Wingborne)', value: '75 – 95 km/h', highlight: true },
      { label: 'Hover Transition Capability', value: 'Instant Multi-rotor VTOL zero-runway launch & recovery' },
      { label: 'Mission Endurance', value: '75 – 90 min sustained fixed-wing cruise' },
      { label: 'Wind Resistance', value: 'Up to 14 m/s (approx. 50 km/h gusts)' },
      { label: 'Stall Prevention', value: 'Nose Pitot Dynamic Ram-Air Differential Transducer' },
      { label: 'Emergency Protocol', value: 'Autonomous Return-to-Home (RTH) with VTOL auto-landing' }
    ]
  },
  {
    title: 'Edge AI & Dual Sensing',
    items: [
      { label: 'AI Supercomputing Core', value: 'NVIDIA Jetson Orin Nano Super 8GB (40 TOPS)', highlight: true },
      { label: 'AI Detection Model', value: 'YOLO11n-based lightweight quantized edge neural network' },
      { label: 'Dual-Lens Nose Turret', value: 'Smooth Spherical Gimbal with Soft Amber-Orange Glass Reflections', highlight: true },
      { label: 'RGB Day Vision', value: 'Ultra-HD Optical Visual Imagery Sensor' },
      { label: 'Thermal Infrared Vision', value: '256×192 LWIR Radiometric Heat Signature Sensor', highlight: true },
      { label: 'Sensor Fusion', value: 'Hardware-synchronized Optical + Thermal Bounding Box Fusion' }
    ]
  },
  {
    title: 'Communication & Navigation',
    items: [
      { label: 'Telemetry & Evidence Link', value: 'Semtech SX1262 LoRa (868 / 915 MHz)', highlight: true },
      { label: 'LoRa Range', value: '25+ km Line-of-Sight (LOS) to Ground Gateway' },
      { label: 'Ground Base Station', value: 'Static Ruggedized Base Console on Grid Floor [25]', highlight: true },
      { label: 'Data Transmission', value: 'Packetized GPS pins, survivor telemetry & compressed visual tiles' },
      { label: 'Satellite Navigation', value: 'Spine-Mounted Multi-Constellation GPS/GNSS + Compass Mast' },
      { label: 'Inertial Navigation', value: 'Triple-Redundant EKF3 Attitude & Heading Reference' }
    ]
  }
];

export const COLOR_SCHEME_SPEC = [
  { part: 'Fuselage & Main Wings', color: 'Matte Dark Charcoal Carbon', hex: '#1A1A1C', desc: 'Carbon fiber monocoque (roughness: 0.3, metalness: 0.8)' },
  { part: 'Upper Aerodynamic Fairings', color: 'Aero White Composite', hex: '#F4F5F8', desc: 'SILENTRESQ high-contrast aerospace composite paneling' },
  { part: 'Spine & Orientation Stripe', color: 'Electric Cyan Glow', hex: '#00E5FF', desc: 'Aerodynamic dorsal spine beacon and LED navigation outline' },
  { part: 'VTOL & Cruise Motors', color: 'Sandblasted Black Anodized', hex: '#121316', desc: 'High-torque brushless outrunners with copper stator accents' },
  { part: 'Propeller Blades', color: 'Glossy Black Carbon', hex: '#0C0C0E', desc: 'Acoustically tuned 2-blade vertical lift and cruise blades' },
  { part: 'Nose Turret Dual Lenses', color: 'Soft Amber-Orange Glass', hex: '#FF8C00', desc: 'Anti-reflective optical coatings reflecting soft amber light' },
  { part: 'Computing Bay PCB', color: 'Glowing Emerald Green', hex: '#00E676', desc: 'NVIDIA Jetson Orin Nano Super 8GB developer board with subtle glow' }
];
