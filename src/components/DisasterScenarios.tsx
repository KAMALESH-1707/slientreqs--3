import React, { useState } from 'react';
import { DISASTER_SCENARIOS } from '../data/disasterScenarios';
import { DisasterScenarioData } from '../types';
import {
  Activity,
  Waves,
  Mountain,
  Wind,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Radio,
  ArrowRight,
  Shield
} from 'lucide-react';

export const DisasterScenarios: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<DisasterScenarioData>(
    DISASTER_SCENARIOS[0]
  );

  const scenarioIcons: Record<string, React.ReactNode> = {
    Activity: <Activity className="w-5 h-5 text-[#ff6a00]" />,
    Waves: <Waves className="w-5 h-5 text-[#00e5ff]" />,
    Mountain: <Mountain className="w-5 h-5 text-[#ffd400]" />,
    Wind: <Wind className="w-5 h-5 text-[#168cff]" />,
    Building2: <Building2 className="w-5 h-5 text-[#ff3030]" />
  };

  return (
    <div id="disaster-scenarios" className="bg-[#0a0a0a] border border-white/10 rounded-md p-6 lg:p-8 shadow-xl">
      <div className="border-b border-white/10 pb-4 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF6A00]" />
          <span className="text-[10px] font-mono text-[#FF6A00] uppercase tracking-widest font-semibold">
            DEPLOYMENT MATRIX // MISSION READINESS
          </span>
        </div>
        <h2 className="text-2xl lg:text-3xl font-bold uppercase tracking-tight text-white">
          DISASTER SCENARIO RESPONSE
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-2xl font-sans">
          Select any critical emergency environment to inspect how RESQNET RQ-01 operates when conventional telecommunications and ground access fail.
        </p>
      </div>

      {/* Scenario Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {DISASTER_SCENARIOS.map((scenario) => {
          const isSelected = selectedScenario.id === scenario.id;
          return (
            <button
              key={scenario.id}
              id={`scenario-tab-${scenario.id}`}
              onClick={() => setSelectedScenario(scenario)}
              className={`p-4 rounded-sm border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between min-h-[120px] group ${
                isSelected
                  ? 'bg-white/5 border-l-4 border-l-[#FF6A00] border-white/20 shadow-[0_0_15px_rgba(255,106,0,0.15)]'
                  : 'bg-white/[0.02] border-white/10 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-sm bg-white/5 border border-white/10 group-hover:border-[#FF6A00]/40 transition-colors">
                  {scenarioIcons[scenario.iconName] || <Activity className="w-5 h-5 text-[#FF6A00]" />}
                </span>
                <span
                  className={`w-2 h-2 rounded-full transition-all ${
                    isSelected ? 'bg-[#FF6A00]' : 'bg-transparent'
                  }`}
                />
              </div>

              <div className="mt-3">
                <div
                  className={`font-tech text-base font-bold uppercase tracking-wide transition-colors ${
                    isSelected ? 'text-[#FF6A00]' : 'text-white'
                  }`}
                >
                  {scenario.title}
                </div>
                <div className="text-[10px] font-mono text-gray-500 line-clamp-1 mt-0.5">
                  {scenario.subtitle}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Scenario Detail Matrix */}
      <div className="bg-white/[0.02] border border-white/10 rounded-md p-6">
        <div className="flex flex-col lg:flex-row gap-6 justify-between items-start">
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-sm bg-[#FF6A00]/20 text-[#FF6A00] border border-[#FF6A00]/30 font-mono text-xs font-bold uppercase tracking-wider">
                ACTIVE SCENARIO: {selectedScenario.title}
              </span>
              <span className="text-xs font-mono text-gray-400">
                {selectedScenario.subtitle}
              </span>
            </div>

            {/* Tactical Challenge */}
            <div className="bg-black/50 border border-white/10 rounded-md p-4 border-l-4 border-l-[#ff3030]">
              <div className="flex items-center gap-2 text-xs font-mono text-[#ff3030] font-bold uppercase mb-1.5 tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>GROUND CHALLENGE & HAZARD</span>
              </div>
              <p className="text-sm text-gray-200 leading-relaxed font-sans">
                {selectedScenario.challenge}
              </p>
            </div>

            {/* RESQNET Autonomous Solution */}
            <div className="bg-black/50 border border-white/10 rounded-md p-4 border-l-4 border-l-[#76b900]">
              <div className="flex items-center gap-2 text-xs font-mono text-[#76b900] font-bold uppercase mb-1.5 tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>RESQNET RQ-01 RESPONSE & AIR-TO-GROUND ADVANTAGE</span>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed font-sans">
                {selectedScenario.solution}
              </p>
            </div>
          </div>

          {/* Right Sidebar: Key Sensors & Mission Workflow */}
          <div className="w-full lg:w-96 bg-black/50 border border-white/10 rounded-md p-5 shrink-0 space-y-4">
            <div>
              <div className="text-xs font-mono text-gray-400 font-bold uppercase tracking-widest mb-2">
                CRITICAL SENSORS ENGAGED
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedScenario.keySensors.map((sensor, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-sm bg-white/5 border border-white/10 text-gray-200 font-mono text-xs"
                  >
                    {sensor}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 pt-3">
              <div className="text-xs font-mono text-gray-400 font-bold uppercase tracking-widest mb-2">
                MISSION SORTIE TIMELINE
              </div>
              <p className="text-xs font-mono text-[#00e5ff] leading-relaxed">
                {selectedScenario.workflowStep}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
