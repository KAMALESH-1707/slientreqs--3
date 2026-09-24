import React from 'react';
import { Sparkles, Layers, ShieldAlert, Cpu, Radio, Wind } from 'lucide-react';

interface HeroProps {
  onExploreDrone: () => void;
  onViewArchitecture: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreDrone, onViewArchitecture }) => {
  return (
    <section className="relative pt-6 pb-2">
      {/* Background subtle radial glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-gradient-to-br from-[#FF6A00]/10 to-transparent blur-3xl pointer-events-none opacity-40" />

      {/* Top Banner Tags */}
      <div className="flex flex-wrap items-center gap-2.5 mb-5 relative z-10">
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 text-[#FF6A00] px-3 py-1 rounded-sm text-xs font-mono font-bold tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00] animate-pulse" />
          <span>UNIT SPEC: RQ-01 VTOL</span>
        </div>
        <div className="bg-white/5 border border-white/10 text-gray-400 px-3 py-1 rounded-sm text-[11px] font-mono uppercase tracking-widest">
          HYBRID VTOL FIXED-WING // EDGE AI // OFFLINE SEARCH & RESCUE
        </div>
        <div className="bg-white/5 border border-white/10 text-[#FFD400] px-3 py-1 rounded-sm text-[11px] font-mono uppercase tracking-widest hidden sm:inline-block">
          SILENTRESQ CAD DIGITAL TWIN
        </div>
      </div>

      {/* Main Title & Subtitle */}
      <div className="max-w-4xl space-y-3 relative z-10">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-none">
          <span className="text-[#FF6A00]">RESQNET</span> <span className="text-white font-light">RQ-01 VTOL</span>
        </h1>
        <h2 className="text-sm sm:text-base font-mono uppercase tracking-[0.2em] text-[#00e5ff] font-semibold">
          Autonomous Disaster-Response Hybrid VTOL Fixed-Wing Drone
        </h2>
        <p className="text-sm sm:text-base text-gray-400 font-sans italic max-w-2xl">
          "Zero-runway vertical takeoff combined with high-speed fixed-wing cruise. Offline edge AI for rapid survivor triage across comms-denied disaster zones."
        </p>
      </div>

      {/* Call-to-Action Buttons */}
      <div className="flex flex-wrap items-center gap-4 pt-5 relative z-10">
        <button
          id="hero-btn-explore"
          onClick={onExploreDrone}
          className="flex items-center gap-2 px-6 py-3 rounded-sm bg-[#FF6A00] hover:bg-[#FFD400] text-black font-mono text-xs font-bold uppercase tracking-widest transition-all shadow-[0_0_25px_rgba(255,106,0,0.25)] cursor-pointer"
        >
          <Sparkles className="w-4 h-4 fill-current" />
          <span>EXPLORE 3D CAD TWIN</span>
        </button>

        <button
          id="hero-btn-architecture"
          onClick={onViewArchitecture}
          className="flex items-center gap-2 px-6 py-3 rounded-sm bg-white/5 hover:bg-white/10 text-white border border-white/10 font-mono text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
        >
          <Layers className="w-4 h-4 text-[#FFD400]" />
          <span>25-SUBSYSTEM ARCHITECTURE</span>
        </button>
      </div>

      {/* Quick Spec Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-7 max-w-4xl relative z-10">
        <div className="bg-[#0a0a0a] border border-white/10 rounded-md p-3.5 border-t-2 border-t-[#76b900]">
          <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Edge AI Supercompute</div>
          <div className="text-xs font-mono font-bold text-gray-200 mt-1">Jetson Orin Nano Super 8GB</div>
          <div className="text-[10px] font-mono text-[#76b900] mt-0.5">40 TOPS YOLO11n AI</div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/10 rounded-md p-3.5 border-t-2 border-t-[#ff8c00]">
          <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Dual Turret Lenses</div>
          <div className="text-xs font-mono font-bold text-gray-200 mt-1">RGB + 256×192 LWIR</div>
          <div className="text-[10px] font-mono text-[#ff8c00] mt-0.5">Soft Amber-Orange Lenses</div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/10 rounded-md p-3.5 border-t-2 border-t-[#00e5ff]">
          <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Hybrid Propulsion</div>
          <div className="text-xs font-mono font-bold text-gray-200 mt-1">4 VTOL Lift + 1 Cruise</div>
          <div className="text-[10px] font-mono text-[#00e5ff] mt-0.5">90 Min Fixed-Wing Cruise</div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/10 rounded-md p-3.5 border-t-2 border-t-[#ffd400]">
          <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Off-Grid LoRa Link</div>
          <div className="text-xs font-mono font-bold text-gray-200 mt-1">25+ km LOS Range</div>
          <div className="text-[10px] font-mono text-[#ffd400] mt-0.5">Ground Gateway Link [25]</div>
        </div>
      </div>
    </section>
  );
};
