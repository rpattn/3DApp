import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls, PerspectiveCamera, Sky } from '@react-three/drei';
import JEASINGS from 'jeasings';
import { PerspectiveCamera as ThreePerspectiveCamera, Vector3 } from 'three';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { ModelConfig } from './ModelComponent';
import { ModelManager } from './ModelManager';

const DEFAULT_ENVIRONMENT = 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/autumn_field_puresky_4k.hdr';

const DEFAULT_MODELS: ModelConfig[] = [
  {
    name: 'Foundation',
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF/Duck.gltf',
    position: [0, -2, 0],
    show: true,
  },
  {
    name: 'Helmet',
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF/DamagedHelmet.gltf',
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
}

export function SceneCanvas({
  models = DEFAULT_MODELS,
  environmentUrl = DEFAULT_ENVIRONMENT,
  highlightIndex,
  ambientLight = 0.45,
}: SceneCanvasProps) {
  const cameraRef = useRef<ThreePerspectiveCamera>(null);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  const cameraPosition = useMemo(() => new Vector3(...CAMERA_START.position), []);
  const cameraTarget = useMemo(() => new Vector3(...CAMERA_START.target), []);

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
        <ModelManager models={models} highlightIndex={highlightIndex} />
        <OrbitControls ref={controlsRef as any} enableDamping dampingFactor={0.2} />
        <Environment files={environmentUrl} background />
        <Sky distance={45000} sunPosition={[1000, 1000, 0]} inclination={10} azimuth={5} mieCoefficient={0.05} mieDirectionalG={10} rayleigh={0.7} turbidity={1} />
      </Suspense>
      <ambientLight intensity={ambientLight} />
    </Canvas>
  );
}
