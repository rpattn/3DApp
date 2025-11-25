import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls, PerspectiveCamera, Sky } from '@react-three/drei';
import JEASINGS from 'jeasings';
import { PerspectiveCamera as ThreePerspectiveCamera, Vector3 } from 'three';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { ModelConfig } from './ModelComponent';
import { ModelManager } from './ModelManager';
import { GroundPlane } from './GroundPlane';
import { Ocean } from './Ocean';

const DEFAULT_ASSET_BASE = '/ddm-files';
// Assets in ddm-files are served from its /public root, so we avoid the extra
// "public" segment when building URLs.
const DEFAULT_ENVIRONMENT_RELATIVE = 'autumn_field_puresky_4k.hdr';

const DEFAULT_MODELS: ModelConfig[] = [
  {
    name: 'Foundation',
    url: 'data/demo/generic_fou.glb',
    position: [0, 0, 0],
    show: true,
  },
  {
    name: 'Pin piles',
    url: 'data/demo/generic_pin_piles.glb',
    position: [4, -3, 0],
    show: true,
  },
];

const CAMERA_START = {
  position: [12, 8, 14] as [number, number, number],
  target: [2, 0, 0] as [number, number, number],
};

function JEasingUpdater() {
  useFrame(() => {
    JEASINGS.update();
  });
  return null;
}

interface SceneCanvasProps {
  models?: ModelConfig[];
  environmentUrl?: string;
  highlightIndex?: number;
  ambientLight?: number;
  assetBasePath?: string;
  showGround?: boolean;
  showWater?: boolean;
  waterPosition?: [number, number, number];
}

export function SceneCanvas({
  models = DEFAULT_MODELS,
  environmentUrl,
  highlightIndex,
  ambientLight = 0.45,
  assetBasePath = DEFAULT_ASSET_BASE,
  showGround = true,
  showWater = true,
  waterPosition = [0, -10, 0],
}: SceneCanvasProps) {
  const cameraRef = useRef<ThreePerspectiveCamera>(null);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  const cameraPosition = useMemo(() => new Vector3(...CAMERA_START.position), []);
  const cameraTarget = useMemo(() => new Vector3(...CAMERA_START.target), []);
  const resolvedEnvironment = useMemo(
    () => environmentUrl ?? `${assetBasePath.replace(/\/$/, '')}/${DEFAULT_ENVIRONMENT_RELATIVE}`,
    [assetBasePath, environmentUrl]
  );

  useEffect(() => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;

    if (!camera || !controls) {
      return;
    }

    new JEASINGS.JEasing(camera.position)
      .to({ x: cameraPosition.x, y: cameraPosition.y, z: cameraPosition.z }, 1200)
      .easing(JEASINGS.Cubic.Out)
      .start();

    new JEASINGS.JEasing(controls.target)
      .to({ x: cameraTarget.x, y: cameraTarget.y, z: cameraTarget.z }, 1200)
      .easing(JEASINGS.Cubic.Out)
      .start();
  }, [cameraPosition, cameraTarget]);

  return (
    <Canvas dpr={[1, 1.5]} gl={{ preserveDrawingBuffer: true }} style={{ width: '100%', height: '100%' }}>
      <PerspectiveCamera ref={cameraRef} makeDefault position={CAMERA_START.position} fov={50} far={10000} />
      <JEasingUpdater />
      <Suspense fallback={null}>
        <ModelManager models={models} highlightIndex={highlightIndex} assetBasePath={assetBasePath} />
        <OrbitControls ref={controlsRef as any} enableDamping dampingFactor={0.2} />
        <Environment files={resolvedEnvironment} background />
        <Sky
          distance={45000}
          sunPosition={[1000, 1000, 0]}
          inclination={10}
          azimuth={5}
          mieCoefficient={0.05}
          mieDirectionalG={10}
          rayleigh={0.7}
          turbidity={1}
        />
        <Ocean position={waterPosition} assetBasePath={assetBasePath} show={showWater} />
        <GroundPlane assetBasePath={assetBasePath} show={showGround} />
      </Suspense>
      <ambientLight intensity={ambientLight} />
    </Canvas>
  );
}
