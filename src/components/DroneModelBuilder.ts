import * as THREE from 'three';

// Procedural text decal canvas texture
function createTextTexture(
  text: string,
  bgColor: string = 'transparent',
  textColor: string = '#FFFFFF',
  width: number = 512,
  height: number = 128,
  fontSize: number = 56,
  subtext: string = ''
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  if (bgColor !== 'transparent') {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
  } else {
    ctx.clearRect(0, 0, width, height);
  }

  ctx.fillStyle = textColor;
  ctx.font = `bold ${fontSize}px "Space Grotesk", "Rajdhani", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.letterSpacing = '5px';
  ctx.fillText(text, width / 2, subtext ? height / 2 - 12 : height / 2);

  if (subtext) {
    ctx.font = `bold ${Math.floor(fontSize * 0.42)}px "JetBrains Mono", monospace`;
    ctx.letterSpacing = '3px';
    ctx.fillText(subtext, width / 2, height / 2 + 30);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

// Procedural Carbon-fiber bump map
function createCarbonFiberTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#1c1c1c';
  ctx.fillRect(0, 0, 64, 64);

  ctx.fillStyle = '#3a3a3a';
  for (let y = 0; y < 64; y += 4) {
    for (let x = 0; x < 64; x += 8) {
      const offset = y % 8 === 0 ? 0 : 4;
      ctx.fillRect(x + offset, y, 4, 4);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(16, 16);
  texture.needsUpdate = true;
  return texture;
}

// Procedural Green Circuit Board Texture for NVIDIA Jetson Developer Board
function createPcbTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#062812';
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = '#00e676';
  ctx.lineWidth = 1.5;
  ctx.shadowColor = '#00ff88';
  ctx.shadowBlur = 4;

  // PCB traces
  const traces = [
    [20, 20, 80, 20, 110, 50, 200, 50],
    [20, 40, 60, 40, 90, 70, 90, 140, 160, 140],
    [30, 230, 80, 230, 120, 190, 220, 190],
    [180, 20, 180, 80, 230, 130, 230, 220],
    [50, 100, 80, 100, 80, 160, 140, 160]
  ];

  traces.forEach((t) => {
    ctx.beginPath();
    ctx.moveTo(t[0], t[1]);
    for (let i = 2; i < t.length; i += 2) {
      ctx.lineTo(t[i], t[i + 1]);
    }
    ctx.stroke();
  });

  // Contact pads & solder points
  ctx.fillStyle = '#ffd700';
  for (let x = 30; x < 230; x += 24) {
    for (let y = 30; y < 230; y += 32) {
      if ((x + y) % 3 === 0) {
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Procedural Ground Base-Station Telemetry Screen Texture
function createGroundStationScreen(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#050a0f';
  ctx.fillRect(0, 0, 512, 256);

  ctx.strokeStyle = '#00e5ff';
  ctx.lineWidth = 2;
  ctx.strokeRect(10, 10, 492, 236);

  ctx.fillStyle = '#00e5ff';
  ctx.font = 'bold 22px "JetBrains Mono", monospace';
  ctx.fillText('RESQNET GROUND LORA GATEWAY', 25, 42);

  ctx.font = '14px "JetBrains Mono", monospace';
  ctx.fillStyle = '#30d158';
  ctx.fillText('● SYSTEM STATUS: ONLINE // CARRIER LOCKED', 25, 75);

  ctx.fillStyle = '#e5e7eb';
  ctx.fillText('FREQUENCY: 868.100 MHz  SF: 7  BW: 250 kHz', 25, 110);
  ctx.fillText('SIGNAL RSSI: -82 dBm     SNR: +9.4 dB', 25, 138);
  ctx.fillText('PACKETS RX: 1,482        ERROR RATE: 0.00%', 25, 166);
  ctx.fillText('SURVIVOR COORDS: 34.0522°N, 118.2437°W', 25, 198);

  ctx.fillStyle = '#ff9f0a';
  ctx.fillText('LAST PAYLOAD: TILE #08 / 12 [CONF: 94.8%]', 25, 226);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export interface DroneObjectReferences {
  root: THREE.Group;
  components: Map<string, THREE.Object3D>;
  vtolPropellers: THREE.Object3D[];
  cruisePropeller: THREE.Object3D | null;
  jetsonGlowMesh: THREE.Mesh | null;
  lensGlowLights: THREE.Light[];
  updateExploded: (progress: number) => void;
  tickAnimation: (delta: number, spinPropellers?: boolean) => void;
}

export function buildDroneModel(): DroneObjectReferences {
  const droneRoot = new THREE.Group();
  droneRoot.name = 'HYBRID_VTOL_DRONE_ROOT';

  const componentsMap = new Map<string, THREE.Object3D>();
  const vtolPropellers: THREE.Object3D[] = [];
  let cruisePropeller: THREE.Object3D | null = null;
  let jetsonGlowMesh: THREE.Mesh | null = null;
  const lensGlowLights: THREE.Light[] = [];

  // Exploded transformation trackers: records object, initial pos, exploded vector
  const explodedItems: Array<{
    object: THREE.Object3D;
    initialPos: THREE.Vector3;
    explodedOffset: THREE.Vector3;
  }> = [];

  const registerExploded = (obj: THREE.Object3D, offset: [number, number, number]) => {
    explodedItems.push({
      object: obj,
      initialPos: obj.position.clone(),
      explodedOffset: new THREE.Vector3(...offset)
    });
  };

  // Textures
  const carbonTexture = createCarbonFiberTexture();
  const pcbTexture = createPcbTexture();
  const groundScreenTexture = createGroundStationScreen();
  const silentResqDecal = createTextTexture('SILENTRESQ', 'transparent', '#111113', 512, 128, 62);
  const vtolDecal = createTextTexture('RQ-01 VTOL', 'transparent', '#00e5ff', 512, 128, 54, 'HYBRID FIXED-WING');

  // Materials
  // Premium matte dark charcoal carbon fiber (#1a1a1c, roughness: 0.3, metalness: 0.8)
  const carbonMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#1a1a1c'),
    roughness: 0.3,
    metalness: 0.8,
    bumpMap: carbonTexture,
    bumpScale: 0.008
  });

  // Clean aerodynamic white composite panels matching the blueprint upper surfaces
  const whiteAeroMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#f4f5f8'),
    roughness: 0.25,
    metalness: 0.2
  });

  // Cyan aerodynamic spine and LED glow
  const cyanSpineMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#00e5ff'),
    emissive: new THREE.Color('#00b4d8'),
    emissiveIntensity: 0.85,
    roughness: 0.2,
    metalness: 0.5
  });

  // Sandblasted black anodized aluminum for motor cylinders
  const anodizedAluminumMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#121316'),
    roughness: 0.35,
    metalness: 0.88
  });

  // Copper coil material for motor stators
  const copperCoilMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#b87333'),
    roughness: 0.4,
    metalness: 0.9
  });

  // Glossy black material for propellers (#0c0c0e, low roughness)
  const glossyPropMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#0c0c0e'),
    roughness: 0.1,
    metalness: 0.5
  });

  // Soft amber-orange glass material for nose camera payload turret dual lenses
  const amberLensMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#1a1208'),
    emissive: new THREE.Color('#ff6a00'),
    emissiveIntensity: 0.45,
    roughness: 0.05,
    metalness: 0.95,
    transmission: 0.85,
    ior: 1.62,
    transparent: true,
    opacity: 0.92
  });

  // Thermal germanium lens material with amber iridescent reflection
  const thermalLensMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#241505'),
    emissive: new THREE.Color('#ff8c00'),
    emissiveIntensity: 0.55,
    roughness: 0.1,
    metalness: 0.92,
    transmission: 0.6,
    transparent: true,
    opacity: 0.95
  });

  // Stylized green developer board material that glows softly
  const jetsonBoardMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#073a17'),
    emissive: new THREE.Color('#00e676'),
    emissiveIntensity: 0.35,
    roughness: 0.35,
    metalness: 0.4,
    map: pcbTexture
  });

  // Heatsink matte black aluminum
  const heatsinkMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#1e2024'),
    roughness: 0.4,
    metalness: 0.7
  });

  // Gold connector pins
  const goldPinMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#ffd700'),
    roughness: 0.25,
    metalness: 0.95
  });

  // Battery pack material
  const batteryMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#26282e'),
    roughness: 0.45,
    metalness: 0.35
  });

  // ==========================================
  // [01] HYBRID VTOL FIXED-WING AIRFRAME
  // ==========================================
  const airframeGroup = new THREE.Group();
  airframeGroup.name = 'COMPONENT_01_AIRFRAME';
  airframeGroup.userData = { componentId: 'airframe' };

  // 1. Central Aerodynamic Fuselage
  const fuselageGroup = new THREE.Group();

  // Fuselage Lower Hull (dark charcoal carbon fiber)
  const lowerHullGeom = new THREE.CylinderGeometry(0.12, 0.08, 2.1, 16);
  lowerHullGeom.rotateX(Math.PI / 2);
  lowerHullGeom.scale(1.25, 0.75, 1.0);
  const lowerHull = new THREE.Mesh(lowerHullGeom, carbonMat);
  lowerHull.position.set(0, 0.22, -0.1);
  fuselageGroup.add(lowerHull);

  // Fuselage Nose Fairing (smooth aerodynamic taper forward)
  const noseConeGeom = new THREE.ConeGeometry(0.12, 0.45, 16);
  noseConeGeom.rotateX(Math.PI / 2);
  noseConeGeom.scale(1.25, 0.7, 1.0);
  const noseCone = new THREE.Mesh(noseConeGeom, carbonMat);
  noseCone.position.set(0, 0.21, 0.98);
  fuselageGroup.add(noseCone);

  // Fuselage Upper Deck Shell (White aerodynamic skin paneling from blueprint)
  const upperFairingGeom = new THREE.CylinderGeometry(0.11, 0.07, 1.6, 16, 1, false, 0, Math.PI);
  upperFairingGeom.rotateX(Math.PI / 2);
  upperFairingGeom.rotateZ(Math.PI);
  upperFairingGeom.scale(1.2, 0.8, 1.0);
  const upperFairing = new THREE.Mesh(upperFairingGeom, whiteAeroMat);
  upperFairing.position.set(0, 0.24, 0.05);
  fuselageGroup.add(upperFairing);

  // Cyan Spine Strip (Glowing aerodynamic dorsal spine as seen in blueprint top & side)
  const spineGeom = new THREE.BoxGeometry(0.018, 0.02, 1.45);
  const spineMesh = new THREE.Mesh(spineGeom, cyanSpineMat);
  spineMesh.position.set(0, 0.33, 0.02);
  fuselageGroup.add(spineMesh);

  // Ventral Keel / Landing Skid under belly
  const ventralKeelGeom = new THREE.BoxGeometry(0.04, 0.09, 0.6);
  const ventralKeel = new THREE.Mesh(ventralKeelGeom, carbonMat);
  ventralKeel.position.set(0, 0.12, -0.05);
  fuselageGroup.add(ventralKeel);

  // Twin Vertical Tail Fins at the rear (Canted || configuration)
  const finShape = new THREE.Shape();
  finShape.moveTo(0, 0);
  finShape.lineTo(0.32, 0);
  finShape.lineTo(0.24, 0.38);
  finShape.lineTo(0.08, 0.38);
  finShape.closePath();

  const finExtrudeSettings = { depth: 0.022, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.005, bevelThickness: 0.005 };
  const finGeom = new THREE.ExtrudeGeometry(finShape, finExtrudeSettings);

  [-0.14, 0.14].forEach((xPos) => {
    const tailFinMesh = new THREE.Mesh(finGeom, carbonMat);
    tailFinMesh.position.set(xPos, 0.25, -1.22);
    tailFinMesh.rotation.y = Math.PI / 2;
    tailFinMesh.rotation.z = xPos < 0 ? 0.06 : -0.06; // slight outward cant
    fuselageGroup.add(tailFinMesh);

    // Cyan tip accent on tail fins
    const finTip = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.03, 0.18), cyanSpineMat);
    finTip.position.set(xPos, 0.61, -1.04);
    fuselageGroup.add(finTip);
  });

  airframeGroup.add(fuselageGroup);

  // 2. Fixed Wings: Left and Right Separate Groups for Exploded View
  const leftWingGroup = new THREE.Group();
  leftWingGroup.name = 'LEFT_WING_GROUP';

  const rightWingGroup = new THREE.Group();
  rightWingGroup.name = 'RIGHT_WING_GROUP';

  // Helper to construct tapered fixed wing panel with white top & carbon bottom
  const wingLength = 1.15;
  const wingRootChord = 0.44;
  const wingTipChord = 0.24;
  const wingThickness = 0.038;

  // Wing Box with taper
  const createWingMesh = (isLeft: boolean) => {
    const wingGroup = new THREE.Group();

    // Main wing structure
    const wingGeom = new THREE.BoxGeometry(wingLength, wingThickness, wingRootChord);
    const wingMesh = new THREE.Mesh(wingGeom, carbonMat);
    wingMesh.position.set((isLeft ? -1 : 1) * (wingLength / 2 + 0.12), 0.26, 0.2);
    wingMesh.rotation.y = (isLeft ? 1 : -1) * 0.12; // sweep
    wingGroup.add(wingMesh);

    // White upper wing fairing skin with decals
    const topWingSkinGeom = new THREE.BoxGeometry(wingLength * 0.88, 0.006, wingRootChord * 0.82);
    const topWingSkin = new THREE.Mesh(topWingSkinGeom, whiteAeroMat);
    topWingSkin.position.set((isLeft ? -1 : 1) * (wingLength / 2 + 0.14), 0.28, 0.2);
    topWingSkin.rotation.y = (isLeft ? 1 : -1) * 0.12;
    wingGroup.add(topWingSkin);

    // "SILENTRESQ" decal panel on top of wing
    const decalGeom = new THREE.PlaneGeometry(0.55, 0.14);
    const decalMat = new THREE.MeshBasicMaterial({
      map: silentResqDecal,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide
    });
    const decalMesh = new THREE.Mesh(decalGeom, decalMat);
    decalMesh.rotation.x = -Math.PI / 2;
    decalMesh.rotation.z = isLeft ? -0.12 : 0.12;
    decalMesh.position.set((isLeft ? -1 : 1) * 0.72, 0.285, 0.2);
    wingGroup.add(decalMesh);

    // Diagonal forward carbon brace strut (as seen in front & top views)
    const strutGeom = new THREE.CylinderGeometry(0.016, 0.016, 1.25, 8);
    const strut = new THREE.Mesh(strutGeom, carbonMat);
    strut.rotation.z = (isLeft ? -1 : 1) * 1.35;
    strut.rotation.y = (isLeft ? 1 : -1) * 0.52;
    strut.position.set((isLeft ? -1 : 1) * 0.65, 0.18, 0.42);
    wingGroup.add(strut);

    // Rear boom arm extending to rear VTOL motor
    const rearArmGeom = new THREE.CylinderGeometry(0.02, 0.018, 1.2, 8);
    const rearArm = new THREE.Mesh(rearArmGeom, carbonMat);
    rearArm.rotation.x = Math.PI / 2;
    rearArm.rotation.y = (isLeft ? 1 : -1) * -0.22;
    rearArm.position.set((isLeft ? -1 : 1) * 0.68, 0.28, -0.42);
    wingGroup.add(rearArm);

    return wingGroup;
  };

  const leftWing = createWingMesh(true);
  leftWingGroup.add(leftWing);
  airframeGroup.add(leftWingGroup);

  const rightWing = createWingMesh(false);
  rightWingGroup.add(rightWing);
  airframeGroup.add(rightWingGroup);

  // Register Exploded View for wings: Left slides -X, Right slides +X
  registerExploded(leftWingGroup, [-0.75, 0, 0]);
  registerExploded(rightWingGroup, [0.75, 0, 0]);

  droneRoot.add(airframeGroup);
  componentsMap.set('airframe', airframeGroup);

  // ==========================================
  // [02] VTOL LIFT MOTORS (4x vertical motors)
  // [03] VTOL ESCs (4x electronic speed controllers)
  // [04] VTOL PROPELLERS (4x glossy black blades)
  // ==========================================
  const vtolMotorsGroup = new THREE.Group();
  vtolMotorsGroup.name = 'COMPONENT_02_VTOL_MOTORS';
  vtolMotorsGroup.userData = { componentId: 'vtol-motors' };

  const vtolEscsGroup = new THREE.Group();
  vtolEscsGroup.name = 'COMPONENT_03_VTOL_ESCS';
  vtolEscsGroup.userData = { componentId: 'vtol-escs' };

  const vtolPropsGroup = new THREE.Group();
  vtolPropsGroup.name = 'COMPONENT_04_VTOL_PROPS';
  vtolPropsGroup.userData = { componentId: 'vtol-props' };

  // 4 VTOL Pod Positions from Blueprints
  const motorPositions = [
    { id: 'FL', x: -1.35, y: 0.28, z: 0.45, dir: 1 },
    { id: 'FR', x: 1.35, y: 0.28, z: 0.45, dir: -1 },
    { id: 'RL', x: -0.95, y: 0.32, z: -0.85, dir: -1 },
    { id: 'RR', x: 0.95, y: 0.32, z: -0.85, dir: 1 }
  ];

  motorPositions.forEach((pos) => {
    // 1. Motor Assembly: Cylinder + Stator Coils + Nut
    const motorUnit = new THREE.Group();
    motorUnit.position.set(pos.x, pos.y, pos.z);

    // Motor Pod Nacelle
    const podGeom = new THREE.CylinderGeometry(0.05, 0.045, 0.16, 16);
    const pod = new THREE.Mesh(podGeom, anodizedAluminumMat);
    motorUnit.add(pod);

    // Stator Copper Coils (glowing metallic copper rings)
    const coilGeom = new THREE.TorusGeometry(0.046, 0.008, 8, 24);
    coilGeom.rotateX(Math.PI / 2);
    const coilUpper = new THREE.Mesh(coilGeom, copperCoilMat);
    coilUpper.position.y = 0.04;
    motorUnit.add(coilUpper);

    const coilLower = new THREE.Mesh(coilGeom, copperCoilMat);
    coilLower.position.y = -0.04;
    motorUnit.add(coilLower);

    // Motor Bell Top Cap (Shaft & Lock Nut)
    const capGeom = new THREE.CylinderGeometry(0.022, 0.035, 0.03, 16);
    const cap = new THREE.Mesh(capGeom, anodizedAluminumMat);
    cap.position.y = 0.095;
    motorUnit.add(cap);

    vtolMotorsGroup.add(motorUnit);

    // 2. VTOL ESC module positioned near motor pod
    const escUnit = new THREE.Group();
    escUnit.position.set(pos.x + (pos.x < 0 ? 0.08 : -0.08), pos.y - 0.06, pos.z);

    const escGeom = new THREE.BoxGeometry(0.05, 0.02, 0.09);
    const escMesh = new THREE.Mesh(escGeom, heatsinkMat);
    escUnit.add(escMesh);

    // ESC heat spreader plate
    const escPlate = new THREE.Mesh(new THREE.BoxGeometry(0.048, 0.006, 0.08), anodizedAluminumMat);
    escPlate.position.y = 0.012;
    escUnit.add(escPlate);

    vtolEscsGroup.add(escUnit);

    // 3. VTOL Propeller (2-blade glossy black propeller)
    const propUnit = new THREE.Group();
    propUnit.position.set(pos.x, pos.y + 0.11, pos.z);

    // Central hub
    const hubGeom = new THREE.CylinderGeometry(0.018, 0.024, 0.02, 16);
    const hub = new THREE.Mesh(hubGeom, anodizedAluminumMat);
    propUnit.add(hub);

    // 2 Aerodynamic Propeller Blades
    const bladeGeom = new THREE.BoxGeometry(0.48, 0.006, 0.036);
    const bladeMesh = new THREE.Mesh(bladeGeom, glossyPropMat);
    bladeMesh.rotation.y = 0.08;
    propUnit.add(bladeMesh);

    // White safety tip markings on propeller ends
    [-0.22, 0.22].forEach((tipX) => {
      const tipMesh = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.007, 0.037), whiteAeroMat);
      tipMesh.position.x = tipX;
      propUnit.add(tipMesh);
    });

    // Store propeller for animation rotation
    vtolPropellers.push(propUnit);
    vtolPropsGroup.add(propUnit);
  });

  // Exploded View for VTOL Pods & Props: lift straight up on Y-axis
  registerExploded(vtolMotorsGroup, [0, 0.4, 0]);
  registerExploded(vtolEscsGroup, [0, 0.3, 0]);
  registerExploded(vtolPropsGroup, [0, 0.58, 0]);

  droneRoot.add(vtolMotorsGroup);
  droneRoot.add(vtolEscsGroup);
  droneRoot.add(vtolPropsGroup);

  componentsMap.set('vtol-motors', vtolMotorsGroup);
  componentsMap.set('vtol-escs', vtolEscsGroup);
  componentsMap.set('vtol-props', vtolPropsGroup);

  // ==========================================
  // [05] CRUISE MOTOR (Single rear motor)
  // [06] CRUISE ESC
  // [07] CRUISE PROPELLER
  // ==========================================
  const cruiseMotorGroup = new THREE.Group();
  cruiseMotorGroup.name = 'COMPONENT_05_CRUISE_MOTOR';
  cruiseMotorGroup.userData = { componentId: 'cruise-motor' };

  // Dedicated rear pusher motor cylinder
  const cruiseMotorGeom = new THREE.CylinderGeometry(0.042, 0.042, 0.09, 16);
  cruiseMotorGeom.rotateX(Math.PI / 2);
  const cruiseMotorBody = new THREE.Mesh(cruiseMotorGeom, anodizedAluminumMat);
  cruiseMotorBody.position.set(0, 0.26, -1.18);
  cruiseMotorGroup.add(cruiseMotorBody);

  // Stator coil ring on cruise motor
  const cruiseCoilGeom = new THREE.TorusGeometry(0.043, 0.006, 8, 20);
  const cruiseCoil = new THREE.Mesh(cruiseCoilGeom, copperCoilMat);
  cruiseCoil.position.set(0, 0.26, -1.16);
  cruiseMotorGroup.add(cruiseCoil);

  registerExploded(cruiseMotorGroup, [0, 0, -0.4]);
  droneRoot.add(cruiseMotorGroup);
  componentsMap.set('cruise-motor', cruiseMotorGroup);

  // [06] Cruise ESC in rear conduit
  const cruiseEscGroup = new THREE.Group();
  cruiseEscGroup.name = 'COMPONENT_06_CRUISE_ESC';
  cruiseEscGroup.userData = { componentId: 'cruise-esc' };

  const cruiseEscGeom = new THREE.BoxGeometry(0.045, 0.02, 0.08);
  const cruiseEscMesh = new THREE.Mesh(cruiseEscGeom, heatsinkMat);
  cruiseEscMesh.position.set(0, 0.26, -0.92);
  cruiseEscGroup.add(cruiseEscMesh);

  registerExploded(cruiseEscGroup, [0, 0, -0.2]);
  droneRoot.add(cruiseEscGroup);
  componentsMap.set('cruise-esc', cruiseEscGroup);

  // [07] Cruise Propeller (Rear forward-propulsion blades)
  const cruisePropGroup = new THREE.Group();
  cruisePropGroup.name = 'COMPONENT_07_CRUISE_PROP';
  cruisePropGroup.userData = { componentId: 'cruise-prop' };
  cruisePropGroup.position.set(0, 0.26, -1.26);

  const cruiseHub = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.02, 0.02, 16), anodizedAluminumMat);
  cruiseHub.rotation.x = Math.PI / 2;
  cruisePropGroup.add(cruiseHub);

  // 2-blade pusher propeller
  const cruiseBlade = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.028, 0.006), glossyPropMat);
  cruisePropGroup.add(cruiseBlade);

  cruisePropeller = cruisePropGroup;
  registerExploded(cruisePropGroup, [0, 0, -0.6]);
  droneRoot.add(cruisePropGroup);
  componentsMap.set('cruise-prop', cruisePropGroup);

  // ==========================================
  // [21] RGB CAMERA & [22] 256×192 LWIR THERMAL CAMERA
  // Smooth spherical nose turret beneath nose with dual dark-glass lenses reflecting soft amber-orange light
  // ==========================================
  const cameraTurretGroup = new THREE.Group();
  cameraTurretGroup.name = 'CAMERA_TURRET_MODULE';
  cameraTurretGroup.position.set(0, 0.06, 0.98);

  // 2-Axis Gimbal Bracket (tactical black)
  const gimbalBracketGeom = new THREE.CylinderGeometry(0.065, 0.065, 0.04, 16);
  const gimbalBracket = new THREE.Mesh(gimbalBracketGeom, anodizedAluminumMat);
  gimbalBracket.position.set(0, 0.05, 0);
  cameraTurretGroup.add(gimbalBracket);

  // Spherical Turret Ball Housing
  const ballGeom = new THREE.SphereGeometry(0.088, 32, 24);
  const ballMesh = new THREE.Mesh(ballGeom, anodizedAluminumMat);
  cameraTurretGroup.add(ballMesh);

  // Front bezel face for dual lenses
  const bezelGeom = new THREE.BoxGeometry(0.12, 0.055, 0.015);
  const bezelMesh = new THREE.Mesh(bezelGeom, carbonMat);
  bezelMesh.position.set(0, 0, 0.085);
  cameraTurretGroup.add(bezelMesh);

  // [21] RGB Optical Lens (Left Lens)
  const rgbGroup = new THREE.Group();
  rgbGroup.name = 'COMPONENT_21_RGB_CAMERA';
  rgbGroup.userData = { componentId: 'rgb-camera' };
  rgbGroup.position.set(-0.036, 0, 0.09);

  const rgbRimGeom = new THREE.TorusGeometry(0.02, 0.004, 12, 24);
  const rgbRim = new THREE.Mesh(rgbRimGeom, anodizedAluminumMat);
  rgbGroup.add(rgbRim);

  const rgbLensGeom = new THREE.SphereGeometry(0.018, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  rgbLensGeom.rotateX(Math.PI / 2);
  const rgbLens = new THREE.Mesh(rgbLensGeom, amberLensMat);
  rgbGroup.add(rgbLens);

  // Soft amber reflection point light
  const rgbGlowLight = new THREE.PointLight('#ff8c00', 0.6, 0.35);
  rgbGlowLight.position.set(0, 0, 0.03);
  rgbGroup.add(rgbGlowLight);
  lensGlowLights.push(rgbGlowLight);

  cameraTurretGroup.add(rgbGroup);
  componentsMap.set('rgb-camera', rgbGroup);

  // [22] 256×192 LWIR Thermal Camera (Right Lens)
  const thermalGroup = new THREE.Group();
  thermalGroup.name = 'COMPONENT_22_THERMAL_CAMERA';
  thermalGroup.userData = { componentId: 'thermal-camera' };
  thermalGroup.position.set(0.036, 0, 0.09);

  const thermalRimGeom = new THREE.TorusGeometry(0.018, 0.004, 12, 24);
  const thermalRim = new THREE.Mesh(thermalRimGeom, anodizedAluminumMat);
  thermalGroup.add(thermalRim);

  const thermalLensGeom = new THREE.SphereGeometry(0.016, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  thermalLensGeom.rotateX(Math.PI / 2);
  const thermalLens = new THREE.Mesh(thermalLensGeom, thermalLensMat);
  thermalGroup.add(thermalLens);

  const thermalGlowLight = new THREE.PointLight('#ff6a00', 0.5, 0.35);
  thermalGlowLight.position.set(0, 0, 0.03);
  thermalGroup.add(thermalGlowLight);
  lensGlowLights.push(thermalGlowLight);

  cameraTurretGroup.add(thermalGroup);
  componentsMap.set('thermal-camera', thermalGroup);

  // Exploded View for Nose Turret: slides forward along Z-axis (+0.55 Z)
  registerExploded(cameraTurretGroup, [0, 0, 0.55]);
  droneRoot.add(cameraTurretGroup);

  // ==========================================
  // [20] NVIDIA JETSON ORIN NANO SUPER 8GB (Internal Computing Bay)
  // Stylized green developer board inside core fuselage that glows softly
  // ==========================================
  const jetsonGroup = new THREE.Group();
  jetsonGroup.name = 'COMPONENT_20_JETSON_ORIN_NANO';
  jetsonGroup.userData = { componentId: 'jetson-orin-nano' };
  jetsonGroup.position.set(0, 0.32, 0.32);

  // Styled Green Developer PCB
  const jetsonPcbGeom = new THREE.BoxGeometry(0.14, 0.008, 0.18);
  const jetsonPcb = new THREE.Mesh(jetsonPcbGeom, jetsonBoardMat);
  jetsonGroup.add(jetsonPcb);

  // Black Aluminum Heatsink on top of Jetson Board
  const jetsonHeatsinkGeom = new THREE.BoxGeometry(0.11, 0.026, 0.13);
  const jetsonHeatsink = new THREE.Mesh(jetsonHeatsinkGeom, heatsinkMat);
  jetsonHeatsink.position.set(0, 0.018, 0);
  jetsonGroup.add(jetsonHeatsink);

  // Fin ridges on heatsink
  for (let i = -0.045; i <= 0.045; i += 0.015) {
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.005, 0.01, 0.12), heatsinkMat);
    fin.position.set(i, 0.033, 0);
    jetsonGroup.add(fin);
  }

  // Glowing Green Developer Indicator Strip & Point Light
  const glowBarGeom = new THREE.BoxGeometry(0.08, 0.006, 0.012);
  const glowBarMat = new THREE.MeshBasicMaterial({ color: '#00e676' });
  const glowBar = new THREE.Mesh(glowBarGeom, glowBarMat);
  glowBar.position.set(0, 0.038, 0.04);
  jetsonGroup.add(glowBar);
  jetsonGlowMesh = glowBar;

  const jetsonLight = new THREE.PointLight('#00e676', 0.8, 0.6);
  jetsonLight.position.set(0, 0.06, 0);
  jetsonGroup.add(jetsonLight);

  // Gold I/O pins edge connector
  const edgePins = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.006, 0.015), goldPinMat);
  edgePins.position.set(0, 0.004, -0.095);
  jetsonGroup.add(edgePins);

  // [23] Onboard Storage (NVMe M.2 SSD flat against Jetson)
  const storageGroup = new THREE.Group();
  storageGroup.name = 'COMPONENT_23_ONBOARD_STORAGE';
  storageGroup.userData = { componentId: 'onboard-storage' };
  storageGroup.position.set(0.045, 0.008, 0.02);

  const ssdGeom = new THREE.BoxGeometry(0.028, 0.006, 0.08);
  const ssdMesh = new THREE.Mesh(ssdGeom, heatsinkMat);
  storageGroup.add(ssdMesh);

  // Thermal pad label
  const ssdLabel = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.002, 0.05), whiteAeroMat);
  ssdLabel.position.y = 0.004;
  storageGroup.add(ssdLabel);

  jetsonGroup.add(storageGroup);
  componentsMap.set('onboard-storage', storageGroup);

  // Exploded View for Jetson & SSD: Lifts vertically up out of fuselage (+0.62 Y)
  registerExploded(jetsonGroup, [0, 0.62, 0]);
  droneRoot.add(jetsonGroup);
  componentsMap.set('jetson-orin-nano', jetsonGroup);

  // ==========================================
  // [08] FLIGHT CONTROLLER / AUTOPILOT
  // ==========================================
  const fcGroup = new THREE.Group();
  fcGroup.name = 'COMPONENT_08_FLIGHT_CONTROLLER';
  fcGroup.userData = { componentId: 'flight-controller' };
  fcGroup.position.set(0, 0.28, 0.05);

  const fcBoxGeom = new THREE.BoxGeometry(0.09, 0.03, 0.09);
  const fcMat = new THREE.MeshStandardMaterial({ color: '#ff6a00', roughness: 0.3, metalness: 0.5 });
  const fcMesh = new THREE.Mesh(fcBoxGeom, fcMat);
  fcGroup.add(fcMesh);

  // Autopilot multicolor status LED
  const fcLed = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.006, 16), new THREE.MeshBasicMaterial({ color: '#00e5ff' }));
  fcLed.position.set(0, 0.018, 0);
  fcGroup.add(fcLed);

  registerExploded(fcGroup, [0, 0.48, 0]);
  droneRoot.add(fcGroup);
  componentsMap.set('flight-controller', fcGroup);

  // [11] Barometer (nested near autopilot)
  const baroGroup = new THREE.Group();
  baroGroup.name = 'COMPONENT_11_BAROMETER';
  baroGroup.userData = { componentId: 'barometer' };
  baroGroup.position.set(0.06, 0.27, 0.12);

  const baroMesh = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.015, 0.025), new THREE.MeshStandardMaterial({ color: '#5e5ce6', metalness: 0.8 }));
  baroGroup.add(baroMesh);

  registerExploded(baroGroup, [0, 0.48, 0]);
  droneRoot.add(baroGroup);
  componentsMap.set('barometer', baroGroup);

  // ==========================================
  // [09] GPS/GNSS + COMPASS (Mast extending from upper fuselage spine)
  // ==========================================
  const gpsGroup = new THREE.Group();
  gpsGroup.name = 'COMPONENT_09_GPS_COMPASS';
  gpsGroup.userData = { componentId: 'gps-compass' };
  gpsGroup.position.set(0, 0.46, -0.25);

  // Antenna Mast rod
  const mastGeom = new THREE.CylinderGeometry(0.008, 0.01, 0.14, 12);
  const mast = new THREE.Mesh(mastGeom, carbonMat);
  mast.position.y = -0.06;
  gpsGroup.add(mast);

  // Ceramic Patch Antenna Dome
  const domeGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.022, 24);
  const dome = new THREE.Mesh(domeGeom, whiteAeroMat);
  gpsGroup.add(dome);

  // Compass heading indicator ring
  const ringGeom = new THREE.RingGeometry(0.035, 0.045, 24);
  ringGeom.rotateX(-Math.PI / 2);
  const compRing = new THREE.Mesh(ringGeom, new THREE.MeshBasicMaterial({ color: '#30d158' }));
  compRing.position.y = 0.012;
  gpsGroup.add(compRing);

  registerExploded(gpsGroup, [0, 0.65, 0]);
  droneRoot.add(gpsGroup);
  componentsMap.set('gps-compass', gpsGroup);

  // ==========================================
  // [10] AIRSPEED SENSOR + PITOT TUBE (Forward extending tube)
  // ==========================================
  const pitotGroup = new THREE.Group();
  pitotGroup.name = 'COMPONENT_10_AIRSPEED_PITOT';
  pitotGroup.userData = { componentId: 'airspeed-pitot' };
  pitotGroup.position.set(0, 0.22, 1.15);

  // Stainless steel probe tube
  const tubeGeom = new THREE.CylinderGeometry(0.005, 0.005, 0.22, 12);
  tubeGeom.rotateX(Math.PI / 2);
  const tubeMesh = new THREE.Mesh(tubeGeom, new THREE.MeshStandardMaterial({ color: '#d1d5db', roughness: 0.15, metalness: 0.95 }));
  pitotGroup.add(tubeMesh);

  // Pitot nose mount bracket
  const bracketMesh = new THREE.Mesh(new THREE.ConeGeometry(0.016, 0.05, 12), anodizedAluminumMat);
  bracketMesh.rotateX(Math.PI / 2);
  bracketMesh.position.z = -0.08;
  pitotGroup.add(bracketMesh);

  registerExploded(pitotGroup, [0, 0, 0.35]);
  droneRoot.add(pitotGroup);
  componentsMap.set('airspeed-pitot', pitotGroup);

  // ==========================================
  // [12] CONTROL-SURFACE SERVOS
  // ==========================================
  const servoGroup = new THREE.Group();
  servoGroup.name = 'COMPONENT_12_CONTROL_SERVOS';
  servoGroup.userData = { componentId: 'control-servos' };
  servoGroup.position.set(0.85, 0.23, 0.18);

  const servoCase = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.035, 0.045), new THREE.MeshStandardMaterial({ color: '#ff2d55', roughness: 0.3 }));
  servoGroup.add(servoCase);

  const servoHorn = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.03, 8), anodizedAluminumMat);
  servoHorn.position.set(0, 0.02, 0.01);
  servoGroup.add(servoHorn);

  registerExploded(servoGroup, [0.3, 0, 0]);
  droneRoot.add(servoGroup);
  componentsMap.set('control-servos', servoGroup);

  // ==========================================
  // [13] RC RECEIVER
  // ==========================================
  const rcGroup = new THREE.Group();
  rcGroup.name = 'COMPONENT_13_RC_RECEIVER';
  rcGroup.userData = { componentId: 'rc-receiver' };
  rcGroup.position.set(-0.08, 0.26, -0.15);

  const rcMesh = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.012, 0.05), new THREE.MeshStandardMaterial({ color: '#ff9f0a', roughness: 0.4 }));
  rcGroup.add(rcMesh);

  // Dipole wire antennas
  const ant1 = new THREE.Mesh(new THREE.CylinderGeometry(0.002, 0.002, 0.12, 6), carbonMat);
  ant1.rotation.z = Math.PI / 4;
  ant1.position.set(-0.04, 0.03, 0);
  rcGroup.add(ant1);

  registerExploded(rcGroup, [0, 0.44, 0]);
  droneRoot.add(rcGroup);
  componentsMap.set('rc-receiver', rcGroup);

  // ==========================================
  // [14] TELEMETRY RADIO (Underbelly communications antenna)
  // ==========================================
  const telemetryGroup = new THREE.Group();
  telemetryGroup.name = 'COMPONENT_14_TELEMETRY_RADIO';
  telemetryGroup.userData = { componentId: 'telemetry-radio' };
  telemetryGroup.position.set(0, 0.06, -0.4);

  // Downward blade antenna
  const bladeAntShape = new THREE.Shape();
  bladeAntShape.moveTo(0, 0);
  bladeAntShape.lineTo(0.08, 0);
  bladeAntShape.lineTo(0.05, -0.12);
  bladeAntShape.lineTo(0.01, -0.12);
  bladeAntShape.closePath();

  const bladeAntGeom = new THREE.ExtrudeGeometry(bladeAntShape, { depth: 0.008, bevelEnabled: false });
  const bladeAnt = new THREE.Mesh(bladeAntGeom, carbonMat);
  bladeAnt.position.set(-0.004, 0, -0.04);
  telemetryGroup.add(bladeAnt);

  registerExploded(telemetryGroup, [0, -0.25, 0]);
  droneRoot.add(telemetryGroup);
  componentsMap.set('telemetry-radio', telemetryGroup);

  // ==========================================
  // [15] POWER MODULE / CURRENT SENSOR
  // ==========================================
  const powerModuleGroup = new THREE.Group();
  powerModuleGroup.name = 'COMPONENT_15_POWER_MODULE';
  powerModuleGroup.userData = { componentId: 'power-module' };
  powerModuleGroup.position.set(0, 0.2, 0.28);

  const pmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.018, 0.04), new THREE.MeshStandardMaterial({ color: '#ffd60a', roughness: 0.3 }));
  powerModuleGroup.add(pmMesh);

  registerExploded(powerModuleGroup, [0, 0.32, 0]);
  droneRoot.add(powerModuleGroup);
  componentsMap.set('power-module', powerModuleGroup);

  // ==========================================
  // [16] POWER DISTRIBUTION SYSTEM (PDS)
  // ==========================================
  const pdsGroup = new THREE.Group();
  pdsGroup.name = 'COMPONENT_16_PDS_RAIL';
  pdsGroup.userData = { componentId: 'pds-rail' };
  pdsGroup.position.set(0, 0.18, -0.05);

  const pdsMesh = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.01, 0.22), new THREE.MeshStandardMaterial({ color: '#ff453a', metalness: 0.7 }));
  pdsGroup.add(pdsMesh);

  // Copper busbars
  [-0.025, 0.025].forEach((bx) => {
    const busbar = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.006, 0.2), copperCoilMat);
    busbar.position.set(bx, 0.007, 0);
    pdsGroup.add(busbar);
  });

  registerExploded(pdsGroup, [0, 0.25, 0]);
  droneRoot.add(pdsGroup);
  componentsMap.set('pds-rail', pdsGroup);

  // ==========================================
  // [17] 6S 14–16 Ah BATTERY (Large structural block in lower slot)
  // ==========================================
  const batteryGroup = new THREE.Group();
  batteryGroup.name = 'COMPONENT_17_BATTERY_PACK';
  batteryGroup.userData = { componentId: 'battery-pack' };
  batteryGroup.position.set(0, 0.14, 0.0);

  // Heavy battery block
  const batteryBlock = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.07, 0.36), batteryMat);
  batteryGroup.add(batteryBlock);

  // Gold balance leads & strap
  const strap = new THREE.Mesh(new THREE.BoxGeometry(0.136, 0.076, 0.04), new THREE.MeshStandardMaterial({ color: '#ff6a00' }));
  batteryGroup.add(strap);

  // Thick silicone power cables
  const cableGeom = new THREE.CylinderGeometry(0.008, 0.008, 0.1, 8);
  cableGeom.rotateX(Math.PI / 3);
  const cableRed = new THREE.Mesh(cableGeom, new THREE.MeshStandardMaterial({ color: '#e63946' }));
  cableRed.position.set(0.03, 0.04, 0.18);
  batteryGroup.add(cableRed);

  const cableBlack = new THREE.Mesh(cableGeom, new THREE.MeshStandardMaterial({ color: '#111111' }));
  cableBlack.position.set(-0.03, 0.04, 0.18);
  batteryGroup.add(cableBlack);

  registerExploded(batteryGroup, [0, -0.32, 0]);
  droneRoot.add(batteryGroup);
  componentsMap.set('battery-pack', batteryGroup);

  // ==========================================
  // [18] DC-DC / BEC REGULATORS
  // ==========================================
  const becGroup = new THREE.Group();
  becGroup.name = 'COMPONENT_18_BEC_REGULATORS';
  becGroup.userData = { componentId: 'bec-regulators' };
  becGroup.position.set(-0.07, 0.26, 0.22);

  const becMesh = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.016, 0.045), new THREE.MeshStandardMaterial({ color: '#bf5af2', roughness: 0.3 }));
  becGroup.add(becMesh);

  // Inductor choke coil
  const choke = new THREE.Mesh(new THREE.TorusGeometry(0.008, 0.004, 8, 16), copperCoilMat);
  choke.position.y = 0.012;
  becGroup.add(choke);

  registerExploded(becGroup, [0, 0.42, 0]);
  droneRoot.add(becGroup);
  componentsMap.set('bec-regulators', becGroup);

  // ==========================================
  // [19] WIRING, CONNECTORS & SAFETY HARDWARE
  // ==========================================
  const wiringGroup = new THREE.Group();
  wiringGroup.name = 'COMPONENT_19_WIRING_SAFETY';
  wiringGroup.userData = { componentId: 'wiring-safety' };
  wiringGroup.position.set(0, 0.16, -0.25);

  // XT90-S Anti-Spark Safety Plug (Yellow/Orange plug)
  const xt90 = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.02, 0.035), new THREE.MeshStandardMaterial({ color: '#ffd400', roughness: 0.3 }));
  wiringGroup.add(xt90);

  // Braided harness bundle
  const harnessGeom = new THREE.CylinderGeometry(0.012, 0.012, 0.3, 8);
  harnessGeom.rotateX(Math.PI / 2);
  const harness = new THREE.Mesh(harnessGeom, new THREE.MeshStandardMaterial({ color: '#1f2024', roughness: 0.8 }));
  wiringGroup.add(harness);

  registerExploded(wiringGroup, [0, 0.15, 0]);
  droneRoot.add(wiringGroup);
  componentsMap.set('wiring-safety', wiringGroup);

  // ==========================================
  // [24] LORA MODULE (with trailing antenna wire)
  // ==========================================
  const loraGroup = new THREE.Group();
  loraGroup.name = 'COMPONENT_24_LORA_MODULE';
  loraGroup.userData = { componentId: 'lora-module' };
  loraGroup.position.set(0, 0.3, -0.45);

  // SX1262 shielded RF module box
  const loraShield = new THREE.Mesh(
    new THREE.BoxGeometry(0.045, 0.015, 0.055),
    new THREE.MeshStandardMaterial({ color: '#c0c4cc', metalness: 0.9, roughness: 0.2 })
  );
  loraGroup.add(loraShield);

  // LoRa Decal
  const loraLabel = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.002, 0.04), new THREE.MeshBasicMaterial({ color: '#00e5ff' }));
  loraLabel.position.y = 0.009;
  loraGroup.add(loraLabel);

  // Thin trailing wire antenna extending out the rear
  const antWireGeom = new THREE.CylinderGeometry(0.0018, 0.0018, 0.35, 6);
  antWireGeom.rotateX(Math.PI / 2);
  const antWire = new THREE.Mesh(antWireGeom, new THREE.MeshStandardMaterial({ color: '#ffffff', metalness: 0.5 }));
  antWire.position.set(0, -0.02, -0.2);
  loraGroup.add(antWire);

  registerExploded(loraGroup, [0, 0.45, -0.15]);
  droneRoot.add(loraGroup);
  componentsMap.set('lora-module', loraGroup);

  // ==========================================
  // [25] GROUND LORA RECEIVER / GATEWAY
  // Small separate base-station console model resting static on the grid floor far below the hovering drone
  // ==========================================
  const groundStationGroup = new THREE.Group();
  groundStationGroup.name = 'COMPONENT_25_GROUND_LORA_STATION';
  groundStationGroup.userData = { componentId: 'ground-lora-station' };
  // Grid floor is at Y = -0.21, place ground station resting on pad
  groundStationGroup.position.set(0.65, -0.16, 0.85);

  // Rugged tactical pelican case base
  const caseBase = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.06, 0.18),
    new THREE.MeshStandardMaterial({ color: '#1b1d22', roughness: 0.6, metalness: 0.4 })
  );
  groundStationGroup.add(caseBase);

  // Angled Open Lid
  const caseLid = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.025, 0.18),
    new THREE.MeshStandardMaterial({ color: '#16181d', roughness: 0.6, metalness: 0.4 })
  );
  caseLid.position.set(0, 0.09, -0.09);
  caseLid.rotation.x = -0.35; // angled open
  groundStationGroup.add(caseLid);

  // Glowing Telemetry LCD Display inside lid
  const screenMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.18, 0.09),
    new THREE.MeshBasicMaterial({ map: groundScreenTexture })
  );
  screenMesh.position.set(0, 0.09, -0.075);
  screenMesh.rotation.x = -0.35;
  groundStationGroup.add(screenMesh);

  // Console Keyboard / Control Panel
  const panelFace = new THREE.Mesh(
    new THREE.BoxGeometry(0.21, 0.005, 0.14),
    new THREE.MeshStandardMaterial({ color: '#0f1115', roughness: 0.5 })
  );
  panelFace.position.set(0, 0.032, 0.01);
  groundStationGroup.add(panelFace);

  // Dual high-gain omni whip antennas extending upward
  [-0.09, 0.09].forEach((ax) => {
    const whipAnt = new THREE.Mesh(
      new THREE.CylinderGeometry(0.003, 0.004, 0.22, 8),
      new THREE.MeshStandardMaterial({ color: '#ffd700', metalness: 0.9, roughness: 0.2 })
    );
    whipAnt.position.set(ax, 0.12, 0.05);
    groundStationGroup.add(whipAnt);

    // Antenna Base Coil Choke
    const antChoke = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.025, 8), anodizedAluminumMat);
    antChoke.position.set(ax, 0.038, 0.05);
    groundStationGroup.add(antChoke);
  });

  // Soft cyan glow from ground station
  const stationGlow = new THREE.PointLight('#00e5ff', 0.8, 0.8);
  stationGlow.position.set(0, 0.15, 0);
  groundStationGroup.add(stationGlow);

  // Resting static on grid floor (exploded offset = [0, 0, 0])
  registerExploded(groundStationGroup, [0, 0, 0]);
  droneRoot.add(groundStationGroup);
  componentsMap.set('ground-lora-station', groundStationGroup);

  // Exploded View Update Handler
  const updateExploded = (progress: number) => {
    explodedItems.forEach((item) => {
      item.object.position.lerpVectors(
        item.initialPos,
        item.initialPos.clone().add(item.explodedOffset),
        progress
      );
    });
  };

  // Render loop animation tick
  let timeElapsed = 0;
  const tickAnimation = (delta: number, spinProps: boolean = true) => {
    timeElapsed += delta;

    // Spin Propellers if active
    if (spinProps) {
      // 4 VTOL Lift Propellers
      vtolPropellers.forEach((prop, idx) => {
        const direction = idx % 2 === 0 ? 1 : -1;
        prop.rotation.y += delta * 24.0 * direction;
      });

      // Cruise Pusher Propeller
      if (cruisePropeller) {
        cruisePropeller.rotation.z += delta * 32.0;
      }
    }

    // Gentle floating hover bobbing
    droneRoot.position.y = Math.sin(timeElapsed * 1.8) * 0.015;

    // Subtle soft green pulsing glow on NVIDIA Jetson board
    if (jetsonGlowMesh) {
      const pulse = 0.5 + 0.5 * Math.sin(timeElapsed * 3.5);
      (jetsonGlowMesh.material as THREE.MeshBasicMaterial).color.setRGB(0, 0.6 + 0.4 * pulse, 0.3);
    }
  };

  return {
    root: droneRoot,
    components: componentsMap,
    vtolPropellers,
    cruisePropeller,
    jetsonGlowMesh,
    lensGlowLights,
    updateExploded,
    tickAnimation
  };
}
