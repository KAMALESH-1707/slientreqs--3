import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { DroneViewer } from './components/DroneViewer';
import { ComponentPanel } from './components/ComponentPanel';
import { ComponentList } from './components/ComponentList';
import { Architecture } from './components/Architecture';
import { RescueWorkflow } from './components/RescueWorkflow';
import { ImageTransmission } from './components/ImageTransmission';
import { DisasterScenarios } from './components/DisasterScenarios';
import { Specs } from './components/Specs';
import { DRONE_COMPONENTS } from './data/droneComponents';
import { DroneComponentData } from './types';
import { Sparkles, Layers, ShieldCheck, Heart, Radio, Cpu, Compass } from 'lucide-react';

export default function App() {
  const [selectedComponent, setSelectedComponent] = useState<DroneComponentData | null>(null);
  const [exploreMode, setExploreMode] = useState<boolean>(false);
  const [isExploded, setIsExploded] = useState<boolean>(false);

  const handleSelectComponent = (comp: DroneComponentData | null) => {
    setSelectedComponent(comp);
  };

  const handleSelectComponentById = (id: string) => {
    const found = DRONE_COMPONENTS.find((c) => c.id === id);
    if (found) {
      setSelectedComponent(found);
      const viewerEl = document.getElementById('drone-3d-section');
      if (viewerEl) {
        viewerEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreDrone = () => {
    setExploreMode(true);
    scrollToSection('drone-3d-section');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 selection:bg-[#FF6A00] selection:text-black">
      {/* Sticky Top Navigation */}
      <Navigation
        onScrollTo={scrollToSection}
        onExploreDrone={handleExploreDrone}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
        {/* Hero Section */}
        <Hero
          onExploreDrone={handleExploreDrone}
          onViewArchitecture={() => scrollToSection('system-architecture')}
        />

        {/* 3D Digital Twin Viewer Section */}
        <section id="drone-3d-section" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div>
              <span className="text-[10px] font-mono text-[#FF6A00] uppercase font-bold tracking-widest">
                INTERACTIVE 3D CAD TWIN // 360° INSPECTION
              </span>
              <h2 className="text-xl sm:text-2xl font-bold uppercase text-white tracking-tight">
                RESQNET RQ-01 DIGITAL TWIN
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
              <span>Use Left Mouse/Touch to Orbit</span>
              <span>•</span>
              <span>Pinch/Scroll to Zoom</span>
            </div>
          </div>

          {/* 3D Canvas + Optional Inspection Panel Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* 3D Canvas Viewport */}
            <div className={`${selectedComponent ? 'lg:col-span-8' : 'lg:col-span-12'} transition-all duration-300`}>
              <DroneViewer
                selectedComponent={selectedComponent}
                onSelectComponent={handleSelectComponent}
                exploreMode={exploreMode}
                onToggleExplore={setExploreMode}
                isExploded={isExploded}
                onToggleExploded={setIsExploded}
              />
            </div>

            {/* Selected Component Information Panel (Visible when component is chosen) */}
            {selectedComponent && (
              <div className="lg:col-span-4 h-[620px] lg:h-[720px] sticky top-20">
                <ComponentPanel
                  component={selectedComponent}
                  onClose={() => setSelectedComponent(null)}
                  onSelectComponent={handleSelectComponent}
                />
              </div>
            )}
          </div>

          {/* Subsystems Architecture Selector Grid */}
          <ComponentList
            selectedComponent={selectedComponent}
            onSelectComponent={(comp) => {
              setSelectedComponent(comp);
              scrollToSection('drone-3d-section');
            }}
          />
        </section>

        {/* System Architecture Section */}
        <section className="pt-4">
          <Architecture onSelectComponentById={handleSelectComponentById} />
        </section>

        {/* AI-Assisted Rescue Guidance 10-Step Workflow */}
        <section className="pt-4">
          <RescueWorkflow />
        </section>

        {/* How RESQNET Sends Visual Evidence (LoRa Image Packetization) */}
        <section className="pt-4">
          <ImageTransmission />
        </section>

        {/* Disaster Scenario Response Matrix */}
        <section className="pt-4">
          <DisasterScenarios />
        </section>

        {/* Technical Specifications & Color Matrix */}
        <section className="pt-4">
          <Specs />
        </section>
      </main>

      {/* Engineering Footer */}
      <footer className="border-t border-white/10 bg-[#050505] mt-20 py-10 px-4 sm:px-6 lg:px-8 text-xs font-mono text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="text-base font-bold text-white tracking-wider">
              RESQNET RQ-01 // AI POWERED AUTONOMOUS DISASTER RESCUE DRONE
            </div>
            <div className="text-gray-400">
              Locked Aerospace Architecture • NVIDIA Jetson Orin Nano • Semtech SX1262 LoRa • FLIR Lepton 3.5
            </div>
            <div className="text-[11px] text-[#FFD400]">
              Built for Smart India Hackathon & University Aerospace Evaluation
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 text-center md:text-right">
            <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-sm text-gray-300">
              <span className="text-[#FF6A00] font-bold">OFFLINE CORE: </span> 100% Client-Side Executable
            </div>
            <div className="text-[11px] text-gray-500">
              © {new Date().getFullYear()} RESQNET Project. All design rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
