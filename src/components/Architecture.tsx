import React, { useState } from 'react';
import { DroneComponentData } from '../types';
import { DRONE_COMPONENTS } from '../data/droneComponents';
import {
  ArrowDown,
  ArrowRight,
  Eye,
  Flame,
  Cpu,
  ShieldAlert,
  Compass,
  Radio,
  Monitor,
  CheckCircle2,
  Sparkles,
  Sliders,
  Maximize2
} from 'lucide-react';

interface ArchitectureProps {
  onSelectComponentById: (id: string) => void;
}

export const Architecture: React.FC<ArchitectureProps> = ({ onSelectComponentById }) => {
  const [activeNode, setActiveNode] = useState<string | null>('jetson-orin-nano');

  const mainPipeline = [
    {
      id: 'rgb-camera',
      componentId: 'rgb-camera',
      name: 'RGB Optical Camera',
      tech: 'Daylight 1080p/4K @ 30fps',
      desc: 'Captures continuous visible spectrum light for victim identification and terrain recognition.',
      badge: 'Visual Ingestion',
      icon: <Eye className="w-4 h-4 text-[#168cff]" />,
      color: '#168cff'
    },
    {
      id: 'thermal-camera',
      componentId: 'thermal-camera',
      name: 'FLIR Lepton 3.5 Thermal Core',
      tech: 'LWIR 8-14µm Radiometric Array',
      desc: 'Extracts long-wave infrared heat differentials to isolate human body thermal signatures.',
      badge: 'Thermal Sensing',
      icon: <Flame className="w-4 h-4 text-[#ff3030]" />,
      color: '#ff3030'
    },
    {
      id: 'jetson-orin-nano',
      componentId: 'jetson-orin-nano',
      name: 'NVIDIA Jetson Orin Nano Super 8GB',
      tech: '40 TOPS Edge AI Compute Module',
      desc: 'Central computing brain running fine-tuned models entirely offline without internet/cloud reliance.',
      badge: 'Edge Supercomputing',
      icon: <Cpu className="w-4 h-4 text-[#76b900]" />,
      color: '#76b900'
    },
    {
      id: 'yolo-detection',
      componentId: 'jetson-orin-nano',
      name: 'YOLO11n Lightweight AI Detection',
      tech: 'Fine-tuned Edge Neural Network',
      desc: 'Real-time bounding box prediction for survivors, collapsed voids, and hazard cues.',
      badge: 'Neural Inference',
      icon: <Cpu className="w-4 h-4 text-[#ffd400]" />,
      color: '#ffd400'
    },
    {
      id: 'sensor-fusion',
      componentId: 'jetson-orin-nano',
      name: 'RGB + Thermal Sensor Fusion',
      tech: 'Pixel-level Spatial Alignment',
      desc: 'Cross-verifies optical bounding boxes against radiometric thermal hotspots to eliminate false positives.',
      badge: 'Multimodal Fusion',
      icon: <Sliders className="w-4 h-4 text-[#00e5ff]" />,
      color: '#00e5ff'
    },
    {
      id: 'survivor-assessment',
      componentId: 'jetson-orin-nano',
      name: 'Survivor / Hazard Assessment',
      tech: 'Contextual AI Threat Matrix',
      desc: 'Computes detection confidence threshold and flags proximity to hazards (fires, floodwaters, dangling power lines).',
      badge: 'Scene Analytics',
      icon: <ShieldAlert className="w-4 h-4 text-[#ff6a00]" />,
      color: '#ff6a00'
    },
    {
      id: 'localization',
      componentId: 'gps-compass',
      name: 'GPS/GNSS + Compass Localization',
      tech: 'Multi-GNSS Fix + 6-DOF Inertial',
      desc: 'Georeferences survivor coordinates with sub-meter precision and tags timestamp + heading vector.',
      badge: 'Spatial Geotag',
      icon: <Compass className="w-4 h-4 text-[#00d1ff]" />,
      color: '#00d1ff'
    },
    {
      id: 'rescue-event',
      componentId: 'jetson-orin-nano',
      name: 'Rescue Event Generation',
      tech: 'Deterministic Alert Payload Builder',
      desc: 'Packages critical victim coordinates, confidence rating, hazard flags, and image metadata into prioritized packets.',
      badge: 'Event Trigger',
      icon: <Sparkles className="w-4 h-4 text-[#ffb800]" />,
      color: '#ffb800'
    },
    {
      id: 'lora-transmission',
      componentId: 'lora-module',
      name: 'SX1262 LoRa Communication',
      tech: 'E22-900M22S (15 – 25 km LOS Link)',
      desc: 'Transmits low-bandwidth telemetry packets and segmented JPEG chunks without cellular or Wi-Fi network reliance.',
      badge: 'Long-Range RF',
      icon: <Radio className="w-4 h-4 text-[#00e5ff]" />,
      color: '#00e5ff'
    },
    {
      id: 'rescue-station',
      componentId: 'ground-lora-station',
      name: 'Ground LoRa Receiver / Gateway',
      tech: 'LoRa Base Gateway Transceiver',
      desc: 'Receives chirp spread-spectrum packets, performs CRC error validation, and pushes data to responder monitors.',
      badge: 'Ground Receiver',
      icon: <Monitor className="w-4 h-4 text-[#ffffff]" />,
      color: '#ffffff'
    },
    {
      id: 'offline-dashboard',
      componentId: 'airframe',
      name: 'Offline Tactical Rescue Dashboard',
      tech: 'Local Offline Mission Map & UI',
      desc: 'Visualizes survivor map pins, reconstructed photo evidence, and AI-assisted lower-risk approach routes.',
      badge: 'Incident Command',
      icon: <CheckCircle2 className="w-4 h-4 text-[#76b900]" />,
      color: '#76b900'
    }
  ];

  const auxiliaryBranches = [
    {
      title: 'Aerodynamics & Flight Dynamics',
      color: '#ff9e00',
      nodes: [
        {
          name: 'Airspeed Sensor + Pitot Tube',
          sub: 'Dynamic Ram Air Pressure Measurement',
          componentId: 'airspeed-pitot'
        },
        {
          name: 'Flight Autopilot Dynamic Control',
          sub: 'VTOL-to-Fixed-Wing Aerodynamic Transition',
          componentId: 'flight-controller'
        }
      ]
    },
    {
      title: 'Propulsion & Power System',
      color: '#00d1ff',
      nodes: [
        {
          name: '4x VTOL Lift Motors & Propellers',
          sub: 'Instant Zero-Runway Takeoff & Hover',
          componentId: 'vtol-motors'
        },
        {
          name: 'Rear Cruise Motor & Propeller',
          sub: 'High-Efficiency Forward Wingborne Flight',
          componentId: 'cruise-motor'
        }
      ]
    }
  ];

  return (
    <div id="system-architecture" className="space-y-6">
      {/* Section Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#00e5ff]" />
            <span className="text-[10px] font-mono text-[#00e5ff] uppercase tracking-widest font-semibold">
              ENGINEERING PIPELINE // END-TO-END FLOW
            </span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold uppercase tracking-tight text-white">
            RESQNET SYSTEM ARCHITECTURE
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-2xl font-sans">
            Complete data, sensing, and edge-intelligence pipeline. Click any architectural node to inspect its operational role and focus the 3D digital twin.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono text-[#FFD400] bg-[#FFD400]/10 px-3 py-1.5 rounded-sm border border-[#FFD400]/30 uppercase tracking-widest self-start md:self-auto font-semibold">
          <span>INTERACTIVE // CLICK TO INSPECT 3D</span>
        </div>
      </div>

      {/* Main Flowchart Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-11 gap-2.5 items-stretch">
        {mainPipeline.map((node, index) => {
          const isActive = activeNode === node.id;
          return (
            <React.Fragment key={node.id}>
              <div
                id={`arch-node-${node.id}`}
                onClick={() => {
                  setActiveNode(node.id);
                  if (node.componentId) {
                    onSelectComponentById(node.componentId);
                  }
                }}
                className={`flex flex-col justify-between p-3 rounded-sm border transition-all cursor-pointer group ${
                  isActive
                    ? 'bg-white/5 border-l-4 border-l-[#FF6A00] border-white/20 shadow-[0_0_15px_rgba(255,106,0,0.2)]'
                    : 'bg-[#0a0a0a] border border-white/10 hover:bg-white/[0.04]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-[10px] font-mono text-gray-500 font-bold">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="p-1 rounded-sm bg-white/5 text-gray-300 group-hover:text-white border border-white/5">
                      {node.icon}
                    </span>
                  </div>

                  <div className="text-[11px] font-mono uppercase font-bold text-gray-200 group-hover:text-white leading-tight">
                    {node.name}
                  </div>

                  <div className="text-[10px] font-mono text-gray-500 mt-1 line-clamp-2">
                    {node.tech}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                  <span
                    className="px-1.5 py-0.5 rounded-sm text-[9px] font-semibold uppercase tracking-wider"
                    style={{
                      backgroundColor: `${node.color}15`,
                      color: node.color,
                      border: `1px solid ${node.color}35`
                    }}
                  >
                    {node.badge}
                  </span>
                  <span className="text-[#FF6A00] opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                    3D →
                  </span>
                </div>
              </div>

              {/* Arrow Connector on desktop */}
              {index < mainPipeline.length - 1 && (
                <div className="hidden lg:flex items-center justify-center text-white/20 my-auto">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Auxiliary Parallel Branches (Obstacle Avoidance & IMU/GPS Stabilization) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {auxiliaryBranches.map((branch, bIdx) => (
          <div
            key={bIdx}
            className="bg-[#0a0a0a] border border-white/10 rounded-md p-4 flex flex-col justify-between shadow-lg"
          >
            <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-gray-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: branch.color }} />
                {branch.title}
              </span>
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">PARALLEL LOOP</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              {branch.nodes.map((n, nIdx) => (
                <React.Fragment key={nIdx}>
                  <button
                    onClick={() => onSelectComponentById(n.componentId)}
                    className="p-3 bg-white/[0.02] border border-white/10 hover:border-[#FF6A00] hover:bg-white/5 rounded-sm text-left transition-colors group cursor-pointer"
                  >
                    <div className="text-xs font-tech font-bold uppercase text-gray-200 group-hover:text-white">
                      {n.name}
                    </div>
                    <div className="text-[10px] font-mono text-gray-500 mt-0.5">
                      {n.sub}
                    </div>
                  </button>
                  {nIdx === 0 && (
                    <div className="hidden sm:flex items-center justify-center text-white/20">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
