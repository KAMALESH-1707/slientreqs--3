import React from 'react';
import { DroneComponentData } from '../types';
import { DRONE_COMPONENTS } from '../data/droneComponents';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  Radio,
  Eye,
  Crosshair,
  ShieldCheck,
  CheckCircle2,
  Share2
} from 'lucide-react';

interface ComponentPanelProps {
  component: DroneComponentData | null;
  onClose: () => void;
  onSelectComponent: (comp: DroneComponentData) => void;
  onFocus3D?: () => void;
}

export const ComponentPanel: React.FC<ComponentPanelProps> = ({
  component,
  onClose,
  onSelectComponent,
  onFocus3D
}) => {
  if (!component) return null;

  const currentIndex = DRONE_COMPONENTS.findIndex((c) => c.id === component.id);
  const prevComponent =
    currentIndex > 0 ? DRONE_COMPONENTS[currentIndex - 1] : DRONE_COMPONENTS[DRONE_COMPONENTS.length - 1];
  const nextComponent =
    currentIndex < DRONE_COMPONENTS.length - 1 ? DRONE_COMPONENTS[currentIndex + 1] : DRONE_COMPONENTS[0];

  const categoryIcons: Record<string, React.ReactNode> = {
    Structure: <ShieldCheck className="w-4 h-4 text-[#ff6a00]" />,
    'Sensors & Vision': <Eye className="w-4 h-4 text-[#168cff]" />,
    'Computing & AI': <Cpu className="w-4 h-4 text-[#76b900]" />,
    'Avionics & Nav': <Crosshair className="w-4 h-4 text-[#00d1ff]" />,
    Communication: <Radio className="w-4 h-4 text-[#00e5ff]" />,
    Propulsion: <Zap className="w-4 h-4 text-[#ffd400]" />,
    'Power & Signaling': <Sparkles className="w-4 h-4 text-[#ffb800]" />
  };

  return (
    <div
      id="component-inspection-panel"
      className="bg-[#0a0a0a] border border-white/10 rounded-md p-6 shadow-2xl flex flex-col justify-between h-full overflow-y-auto"
    >
      <div>
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-sm bg-[#FF6A00] text-black font-mono text-xs font-bold flex items-center justify-center">
              {component.number}
            </span>
            <div className="flex items-center gap-1.5 text-xs font-mono text-gray-400">
              {categoryIcons[component.category] || <Layers className="w-4 h-4" />}
              <span className="uppercase tracking-widest font-semibold">{component.category}</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onSelectComponent(prevComponent)}
              title="Previous Component"
              className="p-1.5 rounded-sm text-gray-400 hover:text-white hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSelectComponent(nextComponent)}
              title="Next Component"
              className="p-1.5 rounded-sm text-gray-400 hover:text-white hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              title="Close Panel"
              className="p-1.5 rounded-sm text-gray-400 hover:text-red-400 hover:bg-red-950/40 border border-white/10 transition-colors ml-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title & Subname */}
        <div className="mb-6">
          <h3 className="font-tech text-2xl font-bold text-white tracking-wide uppercase">
            {component.name}
          </h3>
          <p className="text-xs font-mono text-[#FFD400] mt-1 font-medium tracking-wide">
            {component.subname}
          </p>
        </div>

        {/* Structured Spec Sections */}
        <div className="space-y-4 text-sm">
          {/* ROLE */}
          <div className="bg-white/[0.02] border border-white/10 rounded-md p-3.5 border-l-4 border-l-[#FF6A00]">
            <div className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00]" />
              PRIMARY ROLE
            </div>
            <p className="text-gray-200 font-medium leading-relaxed text-xs">
              {component.role}
            </p>
          </div>

          {/* WHAT IT DOES */}
          <div className="bg-white/[0.02] border border-white/10 rounded-md p-3.5 border-l-4 border-l-[#FFD400]">
            <div className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFD400]" />
              WHAT IT DOES
            </div>
            <p className="text-gray-300 leading-relaxed text-xs">
              {component.whatItDoes}
            </p>
          </div>

          {/* IN RESQNET (Pipeline flow) */}
          <div className="bg-white/[0.02] border border-white/10 rounded-md p-3.5">
            <div className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff]" />
              IN RESQNET PIPELINE
            </div>
            <div className="bg-black/50 border border-white/10 rounded-sm p-2.5 font-mono text-xs text-[#00e5ff] flex items-center flex-wrap gap-1 leading-normal">
              {component.inResqnet.split('→').map((step, idx, arr) => (
                <React.Fragment key={idx}>
                  <span className="bg-white/5 px-2 py-0.5 rounded-sm border border-white/10 text-gray-200 font-medium text-[11px]">
                    {step.trim()}
                  </span>
                  {idx < arr.length - 1 && <ArrowRight className="w-3 h-3 text-[#FF6A00] shrink-0 inline" />}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* DATA I/O (Input / Output) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="bg-white/[0.02] border border-white/10 rounded-md p-3">
              <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
                INPUT / DATA
              </div>
              <div className="text-xs font-mono text-gray-300 leading-snug">
                {component.inputData}
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/10 rounded-md p-3">
              <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
                OUTPUT PAYLOAD
              </div>
              <div className="text-xs font-mono text-[#76b900] leading-snug font-medium">
                {component.outputData}
              </div>
            </div>
          </div>

          {/* WHY IT MATTERS */}
          <div className="bg-[#FF6A00]/10 border border-[#FF6A00]/30 rounded-md p-3.5">
            <div className="text-[10px] font-mono font-bold text-[#FF6A00] uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6A00]" />
              WHY IT MATTERS IN SEARCH & RESCUE
            </div>
            <p className="text-gray-200 text-xs leading-relaxed">
              {component.whyItMatters}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Component Selector Strip */}
      <div className="border-t border-white/10 pt-4 mt-6 flex items-center justify-between">
        <span className="text-[11px] font-mono text-gray-500 uppercase tracking-wider">
          Part {currentIndex + 1} of {DRONE_COMPONENTS.length}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectComponent(nextComponent)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-sm bg-[#FF6A00] text-black font-mono text-xs font-bold uppercase tracking-widest hover:bg-[#FFD400] transition-colors cursor-pointer"
          >
            <span>NEXT PART</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
