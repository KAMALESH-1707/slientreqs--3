import React from 'react';
import { SPEC_CATEGORIES, COLOR_SCHEME_SPEC } from '../data/specs';
import { Shield, Check, Info, Palette, Cpu, Box, Radio, Zap } from 'lucide-react';

export const Specs: React.FC = () => {
  return (
    <div id="technical-specs" className="space-y-8">
      {/* Section Header */}
      <div className="border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFD400]" />
          <span className="text-[10px] font-mono text-[#FFD400] uppercase tracking-widest font-semibold">
            ENGINEERING METRICS // CERTIFIED DATA
          </span>
        </div>
        <h2 className="text-2xl lg:text-3xl font-bold uppercase tracking-tight text-white">
          TECHNICAL SPECIFICATIONS
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-2xl font-sans">
          Locked airframe, computing, and telemetry parameters for RESQNET RQ-01 autonomous disaster search operations.
        </p>
      </div>

      {/* Specifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {SPEC_CATEGORIES.map((cat, idx) => (
          <div
            key={idx}
            className="bg-[#0a0a0a] border border-white/10 rounded-md p-5 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <h3 className="font-tech text-base font-bold uppercase tracking-wider text-white">
                  {cat.title}
                </h3>
                <span className="w-2 h-2 rounded-full bg-[#FF6A00]" />
              </div>

              <div className="space-y-2.5 font-mono text-xs">
                {cat.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className={`p-2.5 rounded-sm border ${
                      item.highlight
                        ? 'bg-white/5 border-l-4 border-l-[#FF6A00] border-white/10'
                        : 'bg-white/[0.02] border-white/5'
                    }`}
                  >
                    <div className="text-[10px] text-gray-500 uppercase font-semibold">
                      {item.label}
                    </div>
                    <div className={`text-xs font-bold mt-0.5 ${item.highlight ? 'text-[#FF6A00]' : 'text-gray-200'}`}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Visual Identity & Color Scheme Matrix (Source of Truth from Locked Poster) */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-md p-6 lg:p-8 shadow-xl">
        <div className="flex items-center gap-2 border-b border-white/10 pb-4 mb-6">
          <Palette className="w-5 h-5 text-[#FF6A00]" />
          <div>
            <h3 className="text-xl font-bold uppercase tracking-wide text-white">
              LOCKED INDUSTRIAL COLOR SCHEME & VISUAL IDENTITY
            </h3>
            <p className="text-xs font-mono text-gray-400 mt-0.5">
              Strictly preserved color specifications as per finalized RESQNET RQ-01 industrial design.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {COLOR_SCHEME_SPEC.map((spec, sIdx) => (
            <div
              key={sIdx}
              className="bg-white/[0.02] border border-white/10 rounded-sm p-3.5 flex flex-col justify-between min-h-[140px]"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-4 h-4 rounded-full border border-white/20 shadow-sm shrink-0"
                    style={{ backgroundColor: spec.hex }}
                  />
                  <span className="text-[10px] font-mono text-gray-400 uppercase font-bold">
                    {spec.hex}
                  </span>
                </div>
                <div className="font-tech text-sm font-bold uppercase text-white">
                  {spec.color}
                </div>
                <div className="text-[11px] font-mono text-[#FFD400] mt-0.5 font-medium">
                  {spec.part}
                </div>
              </div>

              <div className="text-[10px] font-mono text-gray-500 border-t border-white/10 pt-2 mt-2 leading-tight">
                {spec.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

