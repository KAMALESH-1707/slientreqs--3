import React from 'react';
import { Sparkles } from 'lucide-react';

interface NavigationProps {
  onScrollTo: (id: string) => void;
  onExploreDrone: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onScrollTo, onExploreDrone }) => {
  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10 px-4 lg:px-8 py-4 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-sm bg-[#FF6A00] flex items-center justify-center shadow-[0_0_15px_rgba(255,106,0,0.3)]">
            <span className="font-tech text-black font-black text-base tracking-tighter">RQ</span>
          </div>
          <div>
            <h1 className="text-[#FF6A00] font-bold text-xl sm:text-2xl tracking-tighter leading-none">
              RESQNET <span className="text-white font-light">RQ-01</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mt-1 font-mono">
              AI Powered Autonomous Disaster Rescue Drone
            </p>
          </div>
        </div>

        {/* Center Quick Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-mono tracking-widest uppercase text-gray-400">
          <button
            onClick={() => onScrollTo('drone-3d-section')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            3D DIGITAL TWIN
          </button>
          <button
            onClick={() => onScrollTo('system-architecture')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            ARCHITECTURE
          </button>
          <button
            onClick={() => onScrollTo('rescue-guidance')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            RESCUE GUIDANCE
          </button>
          <button
            onClick={() => onScrollTo('disaster-scenarios')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            SCENARIOS
          </button>
          <button
            onClick={() => onScrollTo('technical-specs')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            SPECS
          </button>
        </nav>

        {/* Right Mission Status & Action */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Mission Status</span>
            <span className="text-green-500 text-xs font-mono tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> SEARCHING AREA 7A
            </span>
          </div>

          <div className="hidden sm:block h-8 w-[1px] bg-white/10 mx-1" />

          <button
            id="nav-btn-explore"
            onClick={onExploreDrone}
            className="bg-[#FF6A00] text-black text-xs font-bold px-5 py-2 rounded-sm uppercase tracking-widest hover:bg-[#FFD400] transition-colors shadow-[0_0_20px_rgba(255,106,0,0.25)] flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>EXPLORE 3D</span>
          </button>
        </div>
      </div>
    </header>
  );
};

