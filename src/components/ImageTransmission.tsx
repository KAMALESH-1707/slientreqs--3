import React, { useState, useEffect } from 'react';
import {
  Camera,
  Cpu,
  FileCheck,
  Minimize2,
  Tag,
  Split,
  Radio,
  ShieldCheck,
  Layers,
  Monitor,
  AlertOctagon,
  ArrowRight,
  Play,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

export const ImageTransmission: React.FC = () => {
  const [currentPacket, setCurrentPacket] = useState<number>(0);
  const [isTransmitting, setIsTransmitting] = useState<boolean>(false);
  const totalPackets = 8;

  const pipelineSteps = [
    { name: 'Camera Capture', sub: 'High-Res Optical / Thermal Frame', icon: <Camera className="w-3.5 h-3.5 text-[#168cff]" /> },
    { name: 'AI Detection', sub: 'YOLO11n Survivor Confirmation', icon: <Cpu className="w-3.5 h-3.5 text-[#76b900]" /> },
    { name: 'Clear Evidence Crop', sub: 'Target ROI Extraction (400×300)', icon: <FileCheck className="w-3.5 h-3.5 text-[#ffd400]" /> },
    { name: 'JPEG Compression', sub: 'Optimized Quantization (~4.8 KB)', icon: <Minimize2 className="w-3.5 h-3.5 text-[#ff6a00]" /> },
    { name: 'ID & Metadata Header', sub: 'GPS, Timestamp, Bounding Box', icon: <Tag className="w-3.5 h-3.5 text-[#00e5ff]" /> },
    { name: 'Packet Segmentation', sub: '8 Chunks × 64-Byte Payload', icon: <Split className="w-3.5 h-3.5 text-[#ff3030]" /> },
    { name: 'LoRa Transmission', sub: 'SX1262 Chirp Spread Spectrum', icon: <Radio className="w-3.5 h-3.5 text-[#00e5ff]" /> },
    { name: 'Packet Verification', sub: 'CRC-16 Error Check & ACK', icon: <ShieldCheck className="w-3.5 h-3.5 text-[#168cff]" /> },
    { name: 'Image Reassembly', sub: 'In-Memory Byte Buffer Stitch', icon: <Layers className="w-3.5 h-3.5 text-[#76b900]" /> },
    { name: 'Offline Dashboard', sub: 'Instant Photographic Proof', icon: <Monitor className="w-3.5 h-3.5 text-[#ffffff]" /> }
  ];

  useEffect(() => {
    let timer: any;
    if (isTransmitting && currentPacket < totalPackets) {
      timer = setTimeout(() => {
        setCurrentPacket((prev) => prev + 1);
      }, 750);
    } else if (currentPacket >= totalPackets) {
      setIsTransmitting(false);
    }
    return () => clearTimeout(timer);
  }, [isTransmitting, currentPacket]);

  const startDemo = () => {
    setCurrentPacket(0);
    setIsTransmitting(true);
  };

  const resetDemo = () => {
    setIsTransmitting(false);
    setCurrentPacket(0);
  };

  return (
    <div id="image-transmission" className="bg-[#0a0a0a] border border-white/10 rounded-md p-6 lg:p-8 shadow-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00e5ff]" />
            <span className="text-[10px] font-mono text-[#00e5ff] uppercase tracking-widest font-semibold">
              OFF-GRID VISUAL TELEMETRY // PACKETIZATION
            </span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold uppercase tracking-tight text-white">
            HOW RESQNET SENDS VISUAL EVIDENCE
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-2xl font-sans">
            LoRa is an ultra-low-bandwidth protocol designed for range, not video streaming. Here is how RESQNET transmits vital photographic evidence without cellular networks.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={startDemo}
            disabled={isTransmitting || currentPacket === totalPackets}
            className="flex items-center gap-1.5 px-4 py-2 rounded-sm bg-[#FF6A00] hover:bg-[#FFD400] text-black font-mono text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-40 cursor-pointer shadow-lg shadow-[#FF6A00]/20"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isTransmitting ? 'TRANSMITTING...' : 'SIMULATE TX'}</span>
          </button>
          <button
            onClick={resetDemo}
            className="p-2 rounded-sm bg-white/5 text-gray-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Critical Architecture Callout Box */}
      <div className="bg-[#FFD400]/5 border border-[#FFD400]/25 rounded-md p-4 mb-6 flex items-start gap-3.5">
        <AlertOctagon className="w-5 h-5 text-[#FFD400] shrink-0 mt-0.5" />
        <div className="text-xs font-mono text-gray-200 leading-relaxed">
          <strong className="text-[#FFD400] uppercase font-bold tracking-wider">BANDWIDTH HIERARCHY RULE: </strong>
          The drone <span className="text-white font-semibold">DOES NOT stream live video</span> over LoRa (which would choke the RF channel).
          Instead, <strong className="text-[#FF6A00]">Critical Rescue Telemetry (GPS, confidence, hazard type) has priority 1</strong>. High-value keyframe evidence is segmented into small 64-byte packets and reassembled sequentially at base camp.
        </div>
      </div>

      {/* Pipeline Steps Flow */}
      <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2 mb-6">
        {pipelineSteps.map((step, idx) => (
          <div
            key={idx}
            className="p-3 bg-white/[0.02] border border-white/10 rounded-sm flex flex-col justify-between min-h-[85px]"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-gray-500 font-bold">
                {String(idx + 1).padStart(2, '0')}
              </span>
              {step.icon}
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase font-bold text-gray-200 leading-tight">
                {step.name}
              </div>
              <div className="text-[9px] font-mono text-gray-500 mt-0.5 line-clamp-1">
                {step.sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Packet Assembly Simulator */}
      <div className="bg-black/50 border border-white/10 rounded-md p-5 grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
        {/* Packet Stream Status */}
        <div className="space-y-3 font-mono text-xs">
          <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
            LORA PACKET STREAM (E22-900M22S)
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between">
              <span className="text-gray-500 uppercase tracking-wider">PAYLOAD ID:</span>
              <span className="text-[#00e5ff] font-bold">#RQ01-SURVIVOR-EVID-42</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 uppercase tracking-wider">COMPRESSED:</span>
              <span className="text-white font-bold">4,608 Bytes (JPEG ROI)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 uppercase tracking-wider">PACKETS:</span>
              <span className="text-[#76b900] font-bold">{currentPacket} / {totalPackets}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 uppercase tracking-wider">STATUS:</span>
              <span className={currentPacket === totalPackets ? 'text-emerald-400 font-bold' : 'text-[#FFD400] font-bold'}>
                {currentPacket === totalPackets ? 'IMAGE FULLY RECONSTRUCTED' : isTransmitting ? 'TRANSMITTING CHUNKS...' : 'READY'}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-[#00e5ff] via-[#FF6A00] to-[#76b900] transition-all duration-300"
              style={{ width: `${(currentPacket / totalPackets) * 100}%` }}
            />
          </div>
        </div>

        {/* Packet Matrix Visualization */}
        <div className="space-y-2">
          <div className="text-[10px] font-mono text-gray-400 uppercase font-bold tracking-widest">
            CHUNK BUFFER MATRIX
          </div>
          <div className="grid grid-cols-4 gap-2 font-mono text-[10px]">
            {Array.from({ length: totalPackets }).map((_, idx) => {
              const isReceived = idx < currentPacket;
              return (
                <div
                  key={idx}
                  className={`p-2 rounded-sm border text-center transition-all ${
                    isReceived
                      ? 'bg-[#FF6A00]/15 border-[#FF6A00] text-[#FF6A00] font-bold shadow-sm'
                      : 'bg-white/[0.02] border-white/5 text-gray-600'
                  }`}
                >
                  <div>CHUNK {idx + 1}</div>
                  <div className="text-[9px] mt-0.5">{isReceived ? 'CRC OK' : 'WAIT'}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reassembled Preview Screen */}
        <div className="bg-white/[0.02] border border-white/10 rounded-md p-3 flex flex-col items-center justify-center text-center relative overflow-hidden h-36">
          {currentPacket === totalPackets ? (
            <div className="space-y-1.5 animate-fade-in">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <div className="font-tech text-sm font-bold uppercase text-white">
                SURVIVOR CONFIRMATION #042
              </div>
              <div className="font-mono text-[10px] text-[#76b900]">
                RGB + Thermal Match // 94.8% Confidence
              </div>
              <div className="font-mono text-[9px] text-gray-400">
                Lat: 28.6139° N, Lon: 77.2090° E
              </div>
            </div>
          ) : (
            <div className="space-y-1 font-mono text-xs text-gray-500">
              <Monitor className="w-6 h-6 mx-auto text-gray-600" />
              <div className="text-[11px]">Reconstructing Visual Matrix...</div>
              <div className="text-[10px] text-[#FF6A00] font-bold">
                {Math.round((currentPacket / totalPackets) * 100)}% Complete
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
