import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { buildDroneModel, DroneObjectReferences } from './DroneModelBuilder';
import { DRONE_COMPONENTS } from '../data/droneComponents';
import { DroneComponentData } from '../types';
import {
  Rotate3d,
  Maximize2,
  Minimize2,
  RotateCcw,
  Eye,
  Layers,
  Sparkles,
  Compass,
  Radio,
  Cpu,
  Crosshair,
  Volume2,
  Info,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  Search,
  Sliders,
  Menu,
  X
} from 'lucide-react';

interface DroneViewerProps {
  selectedComponent: DroneComponentData | null;
  onSelectComponent: (comp: DroneComponentData | null) => void;
  exploreMode: boolean;
  onToggleExplore: (enabled: boolean) => void;
  isExploded: boolean;
  onToggleExploded: (exploded: boolean) => void;
}

export const DroneViewer: React.FC<DroneViewerProps> = ({
  selectedComponent,
  onSelectComponent,
  exploreMode,
  onToggleExplore,
  isExploded,
  onToggleExploded
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // References to keep across re-renders
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const droneRef = useRef<DroneObjectReferences | null>(null);
  const animationFrameId = useRef<number>(0);

  // Camera animation target
  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(2.4, 1.4, 2.4));
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.22, 0));
  const isTransitioningCamera = useRef<boolean>(false);

  // Exploded view animation progress
  const explodedProgress = useRef<number>(0);

  // State
  const [hoveredComponent, setHoveredComponent] = useState<DroneComponentData | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [cameraPreset, setCameraPreset] = useState<'3D' | 'TOP' | 'FRONT' | 'SIDE'>('3D');
  const [spinPropellers, setSpinPropellers] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const [screenHotspots, setScreenHotspots] = useState<Array<{
    comp: DroneComponentData;
    screenX: number;
    screenY: number;
    visible: boolean;
  }>>([]);

  // Telemetry HUD data (simulated live avionics)
  const [telemetry, setTelemetry] = useState({
    pitch: 0.6,
    roll: -0.2,
    heading: 48,
    altitude: '24.5 m',
    airspeed: '74 km/h',
    vtolStatus: 'CRUISE READY',
    linkQuality: '99%',
    rssi: '-81 dBm',
    snr: '+9.8 dB'
  });

  // Filtered 25 components for sidebar
  const filteredComponents = useMemo(() => {
    return DRONE_COMPONENTS.filter((comp) => {
      const matchesSearch =
        comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.number.includes(searchQuery) ||
        comp.subname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = activeCategory === 'ALL' || comp.category === activeCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchQuery, activeCategory]);

  // Setup Three.js Scene
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#050505');
    scene.fog = new THREE.FogExp2('#050505', 0.1);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.set(2.4, 1.4, 2.4);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 0.5;
    controls.maxDistance = 6.5;
    controls.maxPolarAngle = Math.PI / 2 + 0.08;
    controls.target.set(0, 0.22, 0);
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight('#ffffff', 1.15);
    scene.add(ambientLight);

    // Main studio key light
    const keyLight = new THREE.DirectionalLight('#ffffff', 3.0);
    keyLight.position.set(4.5, 6, 4.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Blue fill light
    const fillLight = new THREE.DirectionalLight('#38bdf8', 1.4);
    fillLight.position.set(-4.5, 3.5, -3.5);
    scene.add(fillLight);

    // Warm amber-orange rim light
    const orangeRimLight = new THREE.DirectionalLight('#ff8c00', 1.6);
    orangeRimLight.position.set(0, -1, 3.5);
    scene.add(orangeRimLight);

    // Top soft overhead light
    const overheadLight = new THREE.DirectionalLight('#ffffff', 1.2);
    overheadLight.position.set(0, 8, 0);
    scene.add(overheadLight);

    // 6. Ground Circular Launch Pad & Grid Floor
    const groundGeom = new THREE.CylinderGeometry(2.8, 2.8, 0.02, 64);
    const groundMat = new THREE.MeshStandardMaterial({
      color: '#0a0a0c',
      roughness: 0.85,
      metalness: 0.25
    });
    const ground = new THREE.Mesh(groundGeom, groundMat);
    ground.position.y = -0.22;
    ground.receiveShadow = true;
    scene.add(ground);

    // Engineering Launch Circles
    const ring1Geom = new THREE.RingGeometry(1.0, 1.025, 64);
    ring1Geom.rotateX(-Math.PI / 2);
    const ring1 = new THREE.Mesh(
      ring1Geom,
      new THREE.MeshBasicMaterial({ color: '#ff6a00', opacity: 0.6, transparent: true })
    );
    ring1.position.y = -0.208;
    scene.add(ring1);

    const ring2Geom = new THREE.RingGeometry(2.1, 2.125, 64);
    ring2Geom.rotateX(-Math.PI / 2);
    const ring2 = new THREE.Mesh(
      ring2Geom,
      new THREE.MeshBasicMaterial({ color: '#00e5ff', opacity: 0.35, transparent: true })
    );
    ring2.position.y = -0.208;
    scene.add(ring2);

    // Subtle Grid
    const gridHelper = new THREE.GridHelper(8, 32, '#ff6a00', '#1c1e24');
    gridHelper.position.y = -0.21;
    scene.add(gridHelper);

    // 7. Build Procedural Hybrid VTOL Drone Model
    const drone = buildDroneModel();
    droneRef.current = drone;
    scene.add(drone.root);

    // Clock
    const clock = new THREE.Clock();

    // 8. Animation Render Loop
    let lastHotspotUpdate = 0;
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Drone procedural animations (propeller rotation + LED pulse)
      drone.tickAnimation(delta, spinPropellers);

      // Smooth exploded view lerping
      const targetExploded = isExploded ? 1.0 : 0.0;
      if (Math.abs(explodedProgress.current - targetExploded) > 0.001) {
        explodedProgress.current += (targetExploded - explodedProgress.current) * Math.min(delta * 5.0, 0.25);
        drone.updateExploded(explodedProgress.current);
      }

      // Smooth camera transition when user clicked preset or component
      if (isTransitioningCamera.current) {
        camera.position.lerp(targetCamPos.current, 0.09);
        controls.target.lerp(targetLookAt.current, 0.09);

        if (
          camera.position.distanceTo(targetCamPos.current) < 0.02 &&
          controls.target.distanceTo(targetLookAt.current) < 0.02
        ) {
          isTransitioningCamera.current = false;
        }
      }

      controls.update();
      renderer.render(scene, camera);

      // Periodic calculation of 2D screen positions for 3D hotspots
      if (time - lastHotspotUpdate > 0.05 && containerRef.current) {
        lastHotspotUpdate = time;
        const rect = containerRef.current.getBoundingClientRect();
        const spots = DRONE_COMPONENTS.map((comp) => {
          const currentOffset = isExploded ? comp.explodedOffset : [0, 0, 0];
          const worldPos = new THREE.Vector3(
            comp.position3D[0] + currentOffset[0],
            comp.position3D[1] + currentOffset[1],
            comp.position3D[2] + currentOffset[2]
          );

          worldPos.project(camera);

          const isVisible = worldPos.z < 1.0;
          const screenX = ((worldPos.x + 1) * rect.width) / 2;
          const screenY = ((-worldPos.y + 1) * rect.height) / 2;

          return {
            comp,
            screenX,
            screenY,
            visible: isVisible && screenX > 20 && screenX < rect.width - 20 && screenY > 20 && screenY < rect.height - 20
          };
        });
        setScreenHotspots(spots);
      }
    };

    animate();

    // 9. Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 0 && newH > 0) {
          camera.aspect = newW / newH;
          camera.updateProjectionMatrix();
          renderer.setSize(newW, newH);
        }
      }
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      cancelAnimationFrame(animationFrameId.current);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
    };
  }, [isExploded, spinPropellers]);

  // Periodic telemetry jitter simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry((prev) => ({
        pitch: +(prev.pitch + (Math.random() - 0.5) * 0.3).toFixed(1),
        roll: +(prev.roll + (Math.random() - 0.5) * 0.2).toFixed(1),
        heading: Math.floor((prev.heading + (Math.random() - 0.5) * 2 + 360) % 360),
        altitude: `${(24.2 + (Math.random() - 0.5) * 0.4).toFixed(1)} m`,
        airspeed: `${(74 + Math.floor((Math.random() - 0.5) * 4))} km/h`,
        vtolStatus: 'FIXED-WING CRUISE',
        linkQuality: `${Math.floor(98 + Math.random() * 2)}%`,
        rssi: `-${Math.floor(80 + Math.random() * 3)} dBm`,
        snr: `+${(9.5 + Math.random() * 1.0).toFixed(1)} dB`
      }));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Camera focus animation toward a selected component
  const selectComponentAndFocus = useCallback(
    (comp: DroneComponentData) => {
      onSelectComponent(comp);

      if (!controlsRef.current || !cameraRef.current) return;

      const offset = isExploded ? comp.explodedOffset : [0, 0, 0];
      const targetLook = new THREE.Vector3(
        comp.focusTarget[0] + offset[0],
        comp.focusTarget[1] + offset[1],
        comp.focusTarget[2] + offset[2]
      );

      const targetCam = new THREE.Vector3(
        comp.cameraPosition[0] + offset[0] * 0.8,
        comp.cameraPosition[1] + offset[1] * 0.8,
        comp.cameraPosition[2] + offset[2] * 0.8
      );

      targetLookAt.current.copy(targetLook);
      targetCamPos.current.copy(targetCam);
      isTransitioningCamera.current = true;
    },
    [isExploded, onSelectComponent]
  );

  // When selectedComponent prop changes externally, update camera fly-to
  useEffect(() => {
    if (selectedComponent) {
      selectComponentAndFocus(selectedComponent);
    }
  }, [selectedComponent, selectComponentAndFocus]);

  // Handle Raycasting on Mouse Move & Click
  const handleRaycast = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>, isClick: boolean) => {
      if (!canvasRef.current || !cameraRef.current || !droneRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);

      const intersects = raycaster.intersectObjects(droneRef.current.root.children, true);

      if (intersects.length > 0) {
        let current: THREE.Object3D | null = intersects[0].object;
        let compId: string | null = null;

        while (current && current !== droneRef.current.root) {
          if (current.userData && current.userData.componentId) {
            compId = current.userData.componentId;
            break;
          }
          current = current.parent;
        }

        if (compId) {
          const found = DRONE_COMPONENTS.find((c) => c.id === compId);
          if (found) {
            if (isClick) {
              selectComponentAndFocus(found);
            } else {
              setHoveredComponent(found);
              setTooltipPos({ x: event.clientX - rect.left, y: event.clientY - rect.top });
              canvasRef.current.style.cursor = 'pointer';
            }
            return;
          }
        }
      }

      if (!isClick) {
        setHoveredComponent(null);
        setTooltipPos(null);
        if (canvasRef.current) {
          canvasRef.current.style.cursor = 'grab';
        }
      }
    },
    [selectComponentAndFocus]
  );

  // Camera preset handlers
  const handleSetPreset = (preset: '3D' | 'TOP' | 'FRONT' | 'SIDE') => {
    setCameraPreset(preset);
    isTransitioningCamera.current = true;

    switch (preset) {
      case '3D':
        targetCamPos.current.set(2.4, 1.4, 2.4);
        targetLookAt.current.set(0, 0.22, 0);
        break;
      case 'TOP':
        targetCamPos.current.set(0, 3.4, 0.01);
        targetLookAt.current.set(0, 0.22, 0);
        break;
      case 'FRONT':
        targetCamPos.current.set(0, 0.32, 2.6);
        targetLookAt.current.set(0, 0.22, 0.2);
        break;
      case 'SIDE':
        targetCamPos.current.set(3.2, 0.35, 0);
        targetLookAt.current.set(0, 0.22, 0);
        break;
    }
  };

  // Zoom In / Out handlers
  const handleZoom = (direction: 'in' | 'out') => {
    if (!controlsRef.current || !cameraRef.current) return;
    const factor = direction === 'in' ? 0.75 : 1.33;
    const currentDistance = cameraRef.current.position.distanceTo(controlsRef.current.target);
    const newDistance = Math.max(0.6, Math.min(6.0, currentDistance * factor));

    const dir = new THREE.Vector3()
      .subVectors(cameraRef.current.position, controlsRef.current.target)
      .normalize();

    targetCamPos.current.copy(controlsRef.current.target).addScaledVector(dir, newDistance);
    targetLookAt.current.copy(controlsRef.current.target);
    isTransitioningCamera.current = true;
  };

  // Reset View handler
  const handleResetView = () => {
    onSelectComponent(null);
    handleSetPreset('3D');
  };

  return (
    <div
      ref={containerRef}
      id="drone-3d-viewport"
      className="relative w-full h-[640px] lg:h-[750px] bg-[#050505] select-none overflow-hidden rounded-md border border-white/10 shadow-2xl flex"
    >
      {/* ============================================================ */}
      {/* 25-ITEM COMPONENT SIDEBAR (FLY-TO NAVIGATION)                */}
      {/* ============================================================ */}
      <div
        className={`absolute top-0 bottom-0 left-0 z-30 transition-all duration-300 ease-in-out flex flex-col bg-black/90 backdrop-blur-xl border-r border-white/10 shadow-2xl ${
          sidebarOpen ? 'w-80 sm:w-88 translate-x-0' : 'w-0 -translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-3.5 border-b border-white/10 flex items-center justify-between shrink-0 bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ff6a00] animate-pulse" />
            <div className="font-tech text-sm font-bold uppercase tracking-wider text-white">
              25 SUBSYSTEMS INSPECTOR
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-sm text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Collapse Sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input Filter */}
        <div className="p-2.5 border-b border-white/10 shrink-0">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search 25 components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-black/60 border border-white/10 rounded-sm text-xs font-mono text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#ff6a00]"
            />
          </div>
        </div>

        {/* 25 Components List */}
        <div className="flex-1 overflow-y-auto divide-y divide-white/5 py-1 pr-1 custom-scroll">
          {filteredComponents.map((comp) => {
            const isSelected = selectedComponent?.id === comp.id;
            return (
              <button
                key={comp.id}
                id={`sidebar-item-${comp.id}`}
                onClick={() => selectComponentAndFocus(comp)}
                className={`w-full text-left px-3.5 py-2.5 transition-all flex items-center justify-between group cursor-pointer ${
                  isSelected
                    ? 'bg-[#ff6a00]/15 border-l-4 border-l-[#ff6a00] text-white'
                    : 'hover:bg-white/5 border-l-4 border-l-transparent text-gray-300'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <span
                    className={`font-mono text-[11px] font-bold px-1.5 py-0.5 rounded-sm shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-[#ff6a00] text-black shadow-sm'
                        : 'bg-white/5 text-gray-400 group-hover:text-white group-hover:bg-white/10'
                    }`}
                  >
                    [{comp.number}]
                  </span>
                  <div className="truncate">
                    <div
                      className={`text-xs font-semibold truncate transition-colors ${
                        isSelected ? 'text-[#ff6a00]' : 'text-gray-200 group-hover:text-white'
                      }`}
                    >
                      {comp.name}
                    </div>
                    <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider truncate">
                      {comp.subname}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: comp.colorAccent || '#ff6a00' }}
                  />
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      isSelected ? 'text-[#ff6a00] translate-x-0.5' : 'text-gray-600 group-hover:text-gray-400'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer Info */}
        <div className="p-3 border-t border-white/10 bg-black/80 text-[10px] font-mono text-gray-400 flex items-center justify-between shrink-0">
          <span className="text-[#00e5ff] font-bold">CLICK TO FLY-TO</span>
          <span className="text-gray-500">{filteredComponents.length} / 25 Mapped</span>
        </div>
      </div>

      {/* Sidebar Expand Button (when collapsed) */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/80 backdrop-blur-md border border-white/15 px-3 py-2 rounded-md shadow-xl text-xs font-mono font-bold text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Open 25 Subsystems Sidebar"
        >
          <Menu className="w-4 h-4 text-[#ff6a00]" />
          <span>25 COMPONENTS</span>
        </button>
      )}

      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        id="webgl-canvas"
        className="w-full h-full block cursor-grab active:cursor-grabbing"
        onMouseMove={(e) => handleRaycast(e, false)}
        onClick={(e) => handleRaycast(e, true)}
      />

      {/* Top Left Watermark / Model Header Overlay (hidden when sidebar open on small screens) */}
      <div
        className={`absolute top-4 ${
          sidebarOpen ? 'left-84 sm:left-92' : 'left-48'
        } z-10 pointer-events-none transition-all hidden md:flex flex-col gap-1 bg-black/70 backdrop-blur-md border border-white/10 rounded-md p-3 px-4 shadow-xl`}
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00e5ff] animate-pulse" />
          <span className="font-mono text-[10px] tracking-widest text-[#00e5ff] uppercase font-bold">
            RESQNET HYBRID VTOL // RQ-01
          </span>
          <span className="bg-white/5 text-gray-400 text-[9px] px-2 py-0.5 rounded-sm border border-white/10 font-mono">
            CAD TWIN 3.0
          </span>
        </div>
        <h2 className="text-base lg:text-lg font-bold tracking-tight text-white uppercase flex items-center gap-2">
          HYBRID VTOL FIXED-WING <span className="text-[#ffd400] text-xs font-mono font-normal tracking-wider">Disaster Drone</span>
        </h2>
      </div>

      {/* Top Right Live Avionics Telemetry HUD */}
      <div className="absolute top-4 right-4 z-10 bg-black/75 backdrop-blur-md border border-white/10 rounded-md p-3.5 shadow-xl max-w-[280px] hidden sm:block">
        <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2.5">
          <div className="flex items-center gap-2 text-xs text-gray-300 font-mono uppercase tracking-widest">
            <Radio className="w-3.5 h-3.5 text-[#00e5ff] animate-pulse" />
            <span>AVIONICS HUD</span>
          </div>
          <span className="text-[9px] font-mono text-[#30d158] bg-[#30d158]/10 px-2 py-0.5 rounded-sm border border-[#30d158]/30 font-semibold tracking-wider">
            {telemetry.vtolStatus}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] font-mono">
          <div className="flex justify-between">
            <span className="text-gray-500 uppercase tracking-wider">PROPULSION:</span>
            <span className="text-[#ffd400] font-bold">4 VTOL + 1 CRUISE</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 uppercase tracking-wider">AIRSPEED:</span>
            <span className="text-[#00e5ff] font-bold">{telemetry.airspeed}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 uppercase tracking-wider">AI COMPUTE:</span>
            <span className="text-[#76b900] font-bold">ORIN SUPER 8GB</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 uppercase tracking-wider">DUAL LENS:</span>
            <span className="text-[#ff8c00] font-bold">RGB + LWIR</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 uppercase tracking-wider">LORA LINK:</span>
            <span className="text-white font-bold">{telemetry.rssi}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 uppercase tracking-wider">GROUND GW:</span>
            <span className="text-emerald-400 font-bold">ONLINE [25]</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 uppercase tracking-wider">ALTITUDE:</span>
            <span className="text-gray-200 font-bold">{telemetry.altitude}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 uppercase tracking-wider">HEADING:</span>
            <span className="text-[#ffd400] font-bold">{telemetry.heading}° N</span>
          </div>
        </div>
      </div>

      {/* Floating 3D Hotspot Markers (in Explore Mode) */}
      {exploreMode &&
        screenHotspots.map(({ comp, screenX, screenY, visible }) => {
          if (!visible) return null;
          const isSelected = selectedComponent?.id === comp.id;
          return (
            <button
              key={comp.id}
              id={`hotspot-${comp.id}`}
              onClick={() => selectComponentAndFocus(comp)}
              style={{
                left: `${screenX}px`,
                top: `${screenY}px`,
                transform: 'translate(-50%, -50%)'
              }}
              className={`absolute z-20 transition-transform duration-200 group flex items-center gap-1.5 cursor-pointer ${
                isSelected ? 'scale-125' : 'hover:scale-115'
              }`}
              title={`[${comp.number}] ${comp.name}`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold shadow-lg transition-all ${
                  isSelected
                    ? 'bg-[#ff6a00] text-black ring-4 ring-[#ff6a00]/30 scale-110 shadow-[0_0_15px_rgba(255,106,0,0.5)]'
                    : 'bg-black/90 text-white border border-white/20 hover:border-[#ff6a00] hover:bg-[#ff6a00] hover:text-black'
                }`}
              >
                {comp.number}
              </div>
              <div
                className={`hidden md:block px-2.5 py-1 rounded-sm text-[10px] font-mono uppercase tracking-wider whitespace-nowrap backdrop-blur-md border transition-opacity ${
                  isSelected
                    ? 'bg-[#ff6a00] text-black border-[#ff6a00] font-bold shadow-md'
                    : 'bg-black/90 text-gray-300 border-white/10 opacity-0 group-hover:opacity-100'
                }`}
              >
                {comp.name}
              </div>
            </button>
          );
        })}

      {/* Hover Tooltip (When hovering without explore mode) */}
      {!exploreMode && hoveredComponent && tooltipPos && (
        <div
          style={{
            left: `${tooltipPos.x + 16}px`,
            top: `${tooltipPos.y - 12}px`
          }}
          className="absolute z-30 pointer-events-none bg-black/95 backdrop-blur-md border border-white/15 text-white px-3.5 py-2.5 rounded-md shadow-2xl text-xs font-mono max-w-xs"
        >
          <div className="text-[10px] text-[#ff6a00] font-bold uppercase tracking-widest">
            [{hoveredComponent.number}] // {hoveredComponent.category}
          </div>
          <div className="font-bold text-white text-sm mt-0.5">{hoveredComponent.name}</div>
          <div className="text-[11px] text-gray-400 mt-1 line-clamp-2">{hoveredComponent.role}</div>
          <div className="text-[10px] text-[#ffd400] mt-1.5 flex items-center gap-1 uppercase tracking-wider">
            <span>Click to inspect & fly-to</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>
      )}

      {/* Bottom Bar Controls */}
      <div
        className={`absolute bottom-4 ${
          sidebarOpen ? 'left-84 sm:left-92' : 'left-4'
        } right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-auto transition-all`}
      >
        {/* Left Action Buttons */}
        <div className="flex items-center gap-2 bg-black/85 backdrop-blur-md border border-white/10 p-1.5 rounded-md shadow-xl">
          {/* Explore Mode Toggle */}
          <button
            id="btn-explore-drone"
            onClick={() => onToggleExplore(!exploreMode)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-sm text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
              exploreMode
                ? 'bg-[#ff6a00] text-black shadow-[0_0_15px_rgba(255,106,0,0.35)]'
                : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">{exploreMode ? 'EXIT EXPLORE' : 'EXPLORE DRONE'}</span>
            <span className="sm:hidden">{exploreMode ? 'EXIT' : 'PINS'}</span>
          </button>

          {/* Exploded View Toggle */}
          <button
            id="btn-exploded-view"
            onClick={() => onToggleExploded(!isExploded)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-sm text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
              isExploded
                ? 'bg-[#ffd400] text-black shadow-[0_0_15px_rgba(255,212,0,0.35)]'
                : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isExploded ? 'ASSEMBLE VIEW' : 'EXPLODED VIEW'}</span>
          </button>

          {/* Propeller Animation Toggle */}
          <button
            id="btn-toggle-propellers"
            onClick={() => setSpinPropellers(!spinPropellers)}
            title={spinPropellers ? 'Pause Motors & Propellers' : 'Spin Motors & Propellers'}
            className="p-2 rounded-sm bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10 transition-all hidden md:flex cursor-pointer"
          >
            {spinPropellers ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Center: Camera Preset Buttons */}
        <div className="flex items-center gap-1.5 bg-black/85 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full shadow-xl">
          {(['3D', 'TOP', 'FRONT', 'SIDE'] as const).map((preset) => {
            const isActive = cameraPreset === preset && !selectedComponent;
            return (
              <button
                key={preset}
                id={`btn-preset-${preset.toLowerCase()}`}
                onClick={() => handleSetPreset(preset)}
                className={`px-2.5 sm:px-3 py-1 text-xs font-mono font-bold uppercase tracking-widest transition-all rounded-full cursor-pointer ${
                  isActive
                    ? 'text-[#ff6a00] bg-white/10 border-b-2 border-[#ff6a00]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {preset}
              </button>
            );
          })}
        </div>

        {/* Right: Zoom In, Zoom Out, Reset View */}
        <div className="flex items-center gap-1.5 bg-black/85 backdrop-blur-md border border-white/10 p-1.5 rounded-md shadow-xl">
          <button
            id="btn-zoom-in"
            onClick={() => handleZoom('in')}
            title="Zoom In"
            className="p-1.5 rounded-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            id="btn-zoom-out"
            onClick={() => handleZoom('out')}
            title="Zoom Out"
            className="p-1.5 rounded-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <div className="h-4 w-[1px] bg-white/10 my-auto" />
          <button
            id="btn-reset-view"
            onClick={handleResetView}
            title="Reset View"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-mono font-bold uppercase tracking-wider text-[#ff6a00] hover:bg-[#ff6a00]/10 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">RESET</span>
          </button>
        </div>
      </div>
    </div>
  );
};
