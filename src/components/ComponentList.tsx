import React from 'react';
import { DroneComponentData } from '../types';
import { DRONE_COMPONENTS } from '../data/droneComponents';
import { Sparkles, ChevronRight } from 'lucide-react';

interface ComponentListProps {
  selectedComponent: DroneComponentData | null;
  onSelectComponent: (comp: DroneComponentData) => void;
}

export const ComponentList: React.FC<ComponentListProps> = ({
  selectedComponent,
  onSelectComponent
}) => {
  return (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-md p-5 shadow-xl">
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#ff6a00]" />
          <h3 className="font-tech text-base font-bold uppercase tracking-wider text-white">
            EXPLORE COMPLETE 25-COMPONENT HARDWARE ARCHITECTURE
          </h3>
        </div>
        <span className="text-[10px] font-mono text-[#ffd400] bg-[#ffd400]/10 px-2.5 py-1 rounded-sm border border-[#ffd400]/25 uppercase tracking-widest font-semibold">
          25 SUBSYSTEMS
        </span>
      </div>

      <p className="text-xs text-gray-400 mb-4 leading-relaxed font-sans">
        Select any onboard hardware subsystem below to activate camera fly-to, focus on that exact part in the 3D digital twin, and inspect detailed engineering specifications.
      </p>

      {/* Grid of all 25 components */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 max-h-[420px] overflow-y-auto pr-1">
        {DRONE_COMPONENTS.map((comp) => {
          const isSelected = selectedComponent?.id === comp.id;
          return (
            <button
              key={comp.id}
              id={`comp-card-${comp.id}`}
              onClick={() => onSelectComponent(comp)}
              className={`text-left p-3 rounded-sm border transition-all duration-150 flex items-start justify-between group cursor-pointer ${
                isSelected
                  ? 'bg-white/5 border-l-4 border-l-[#ff6a00] border-white/15 shadow-[0_0_15px_rgba(255,106,0,0.15)]'
                  : 'bg-white/[0.02] border-l-4 border-l-transparent border-white/5 hover:bg-white/5 hover:border-white/15'
              }`}
            >
              <div className="flex items-start gap-2.5 min-w-0 pr-2">
                <span
                  className={`w-7 h-7 rounded-sm font-mono text-[11px] font-bold flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-[#ff6a00] text-black shadow-sm'
                      : 'bg-white/5 text-gray-400 group-hover:text-white group-hover:bg-white/10'
                  }`}
                >
                  {comp.number}
                </span>
                <div className="min-w-0">
                  <div
                    className={`font-tech text-xs font-bold uppercase tracking-wide truncate transition-colors ${
                      isSelected ? 'text-[#ff6a00]' : 'text-gray-200 group-hover:text-white'
                    }`}
                  >
                    {comp.name}
                  </div>
                  <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider line-clamp-1 mt-0.5">
                    {comp.category}
                  </div>
                </div>
              </div>

              <ChevronRight
                className={`w-4 h-4 shrink-0 transition-transform ${
                  isSelected ? 'text-[#ff6a00] translate-x-0.5' : 'text-gray-600 group-hover:text-white'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
