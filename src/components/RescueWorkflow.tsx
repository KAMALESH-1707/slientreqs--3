import React, { useState } from 'react';
import {
  Compass,
  Eye,
  Flame,
  Cpu,
  MapPin,
  AlertTriangle,
  Navigation,
  Radio,
  FileImage,
  Users,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Play
} from 'lucide-react';

export const RescueWorkflow: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const steps = [
    {
      step: 1,
      title: 'Autonomous Area Survey',
      icon: <Compass className="w-4 h-4 text-[#00e5ff]" />,
      desc: 'Drone launches from base camp and executes an autonomous serpentine or spiral search grid over designated disaster sectors at 15–20m AGL.',
      tag: 'Autonomous Flight'
    },
    {
      step: 2,
      title: 'Visible Candidate Detection',
      icon: <Eye className="w-4 h-4 text-[#168cff]" />,
      desc: 'The high-resolution RGB camera streams daylight frames to the onboard AI. The fine-tuned YOLO11n network flags candidate visual bounding boxes for persons.',
      tag: 'RGB Optical Stream'
    },
    {
      step: 3,
      title: 'Thermal Core Confirmation',
      icon: <Flame className="w-4 h-4 text-[#ff3030]" />,
      desc: 'The FLIR Lepton 3.5 thermal camera measures radiant LWIR heat profiles. Human body signatures (36°C–37°C) confirm life signs beneath light rubble, foliage, or darkness.',
      tag: 'LWIR Radiometry'
    },
    {
      step: 4,
      title: 'Edge Sensor Fusion',
      icon: <Cpu className="w-4 h-4 text-[#76b900]" />,
      desc: 'NVIDIA Jetson Orin Nano geometrically fuses optical pixels with thermal temperature matrices, computing a weighted multi-sensor confidence score.',
      tag: 'Offline Jetson AI'
    },
    {
      step: 5,
      title: 'Geodetic Coordinate Fix',
      icon: <MapPin className="w-4 h-4 text-[#00d1ff]" />,
      desc: 'Onboard multi-GNSS receiver and 6-DOF IMU calculate exact georeferenced latitude, longitude, and elevation of the victim, stamping UTC epoch.',
      tag: 'Sub-Meter GNSS'
    },
    {
      step: 6,
      title: 'Surrounding Hazard Evaluation',
      icon: <AlertTriangle className="w-4 h-4 text-[#ff6a00]" />,
      desc: 'The neural network and obstacle sensors evaluate immediate threats within 25m: pooling water, active fires, hanging high-voltage cables, or unstable debris.',
      tag: 'Threat Detection'
    },
    {
      step: 7,
      title: 'AI-Assisted Lower-Risk Approach',
      icon: <Navigation className="w-4 h-4 text-[#ffd400]" />,
      desc: 'The algorithm evaluates terrain clearance and flags open pathways, generating an AI-assisted lower-risk approach recommendation for ground responders.',
      tag: 'Approach Advisory',
      highlight: true
    },
    {
      step: 8,
      title: 'Critical LoRa Telemetry Burst',
      icon: <Radio className="w-4 h-4 text-[#00e5ff]" />,
      desc: 'SX1262 LoRa transmitter broadcasts high-priority 48-byte rescue beacon packets (Coordinates, Confidence, Hazard Type, Time) over 15–20 km line-of-sight.',
      tag: 'SX1262 RF Beacon'
    },
    {
      step: 9,
      title: 'Compressed Evidence Packetization',
      icon: <FileImage className="w-4 h-4 text-[#ffb800]" />,
      desc: 'Target crop is JPEG-compressed into tiny numbered chunk packets and trickled over the low-bandwidth link without blocking primary telemetry.',
      tag: 'Chunked Evidence'
    },
    {
      step: 10,
      title: 'Human Command Decision',
      icon: <Users className="w-4 h-4 text-[#76b900]" />,
      desc: 'Rescue commander reviews coordinates, risk assessment, and photographic evidence on the offline tactical dashboard to dispatch ground squads.',
      tag: 'Human-in-the-Loop'
    }
  ];

  const handleSimulate = () => {
    setIsSimulating(true);
    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current >= steps.length) {
        clearInterval(interval);
        setIsSimulating(false);
      } else {
        setActiveStep(current);
      }
    }, 1200);
  };

  return (
    <div id="rescue-guidance" className="bg-[#0a0a0a] border border-white/10 rounded-md p-6 lg:p-8 shadow-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFD400]" />
            <span className="text-[10px] font-mono text-[#FFD400] uppercase tracking-widest font-semibold">
              CORE INNOVATION // MISSION LIFECYCLE
            </span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold uppercase tracking-tight text-white">
            AI-ASSISTED RESCUE GUIDANCE
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-2xl font-sans">
            Ten-phase autonomous search, sensor fusion, and situational guidance workflow.
          </p>
        </div>

        <button
          onClick={handleSimulate}
          disabled={isSimulating}
          className="flex items-center gap-2 px-4 py-2.5 rounded-sm bg-[#FF6A00] hover:bg-[#FFD400] text-black font-mono text-xs font-bold uppercase tracking-widest transition-all self-start md:self-auto disabled:opacity-50 cursor-pointer shadow-lg shadow-[#FF6A00]/20"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{isSimulating ? 'SIMULATING WORKFLOW...' : 'SIMULATE RESCUE RUN'}</span>
        </button>
      </div>

      {/* Safety Advisory Banner */}
      <div className="mb-6 bg-[#FF6A00]/10 border border-[#FF6A00]/30 rounded-md p-3.5 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#FF6A00] shrink-0 mt-0.5" />
        <div className="text-xs font-mono text-gray-200">
          <span className="text-[#FF6A00] font-bold uppercase tracking-wider">AEROSPACE PROTOCOL DISCLAIMER: </span>
          RESQNET RQ-01 generates an <strong className="text-white font-semibold">"AI-assisted lower-risk approach recommendation"</strong> based on real-time sensory data. The system never claims 100% hazard immunity; human incident commanders retain final tactical authority.
        </div>
      </div>

      {/* Interactive Workflow Horizontal Stepper */}
      <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2 mb-6">
        {steps.map((s, idx) => {
          const isCurrent = activeStep === idx;
          const isPassed = activeStep > idx;
          return (
            <button
              key={s.step}
              onClick={() => setActiveStep(idx)}
              className={`p-2.5 rounded-sm border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[90px] ${
                isCurrent
                  ? 'bg-white/5 border-l-4 border-l-[#FF6A00] border-white/20 shadow-[0_0_15px_rgba(255,106,0,0.15)]'
                  : isPassed
                  ? 'bg-white/[0.03] border-white/10 text-gray-300'
                  : 'bg-white/[0.01] border-white/5 text-gray-500 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`w-5 h-5 rounded-sm font-mono text-[10px] font-bold flex items-center justify-center ${
                    isCurrent
                      ? 'bg-[#FF6A00] text-black font-bold'
                      : isPassed
                      ? 'bg-white/10 text-white'
                      : 'bg-white/5 text-gray-500'
                  }`}
                >
                  {s.step}
                </span>
                {s.icon}
              </div>

              <div
                className={`font-mono text-[10px] uppercase font-bold leading-tight line-clamp-2 mt-2 ${
                  isCurrent ? 'text-white' : 'text-gray-300'
                }`}
              >
                {s.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Step Detailed Card */}
      <div className="bg-white/[0.02] border border-white/10 rounded-md p-5 sm:p-6 flex flex-col md:flex-row gap-6 items-start justify-between">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-sm bg-[#FF6A00]/20 text-[#FF6A00] border border-[#FF6A00]/30 font-mono text-xs font-bold uppercase tracking-wider">
              PHASE {steps[activeStep].step} OF 10
            </span>
            <span className="text-xs font-mono text-[#FFD400] bg-[#FFD400]/10 px-2.5 py-1 rounded-sm border border-[#FFD400]/25 uppercase tracking-wider">
              {steps[activeStep].tag}
            </span>
          </div>

          <h3 className="font-tech text-2xl font-bold uppercase text-white tracking-wide">
            {steps[activeStep].title}
          </h3>

          <p className="text-sm text-gray-300 leading-relaxed font-sans">
            {steps[activeStep].desc}
          </p>
        </div>

        <div className="w-full md:w-80 bg-black/50 border border-white/10 rounded-md p-4 font-mono text-xs shrink-0 space-y-2.5">
          <div className="text-[11px] text-gray-400 font-bold uppercase tracking-widest border-b border-white/10 pb-1.5 flex items-center justify-between">
            <span>TELEMETRY PAYLOAD</span>
            <span className="text-emerald-400">ENCRYPTED</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 uppercase tracking-wider">STAGE:</span>
            <span className="text-white font-bold">{steps[activeStep].title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 uppercase tracking-wider">AI CONFIDENCE:</span>
            <span className="text-[#76b900] font-bold">94.8% (Multi-Stream)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 uppercase tracking-wider">APPROACH:</span>
            <span className="text-[#FFD400] font-bold">Bearing 214° SW (Lower Risk)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 uppercase tracking-wider">BANDWIDTH:</span>
            <span className="text-[#00e5ff] font-bold">62.5 kHz CSS LoRa</span>
          </div>
        </div>
      </div>
    </div>
  );
};
