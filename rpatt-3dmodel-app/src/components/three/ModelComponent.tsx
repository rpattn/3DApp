import React, { useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import { Select } from '@react-three/postprocessing';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Vector3 } from 'three';

export type ModelConfig = {
  name: string;
  url: string;
  position?: [number, number, number];
  show?: boolean;
  highlight?: boolean;
};

interface ModelComponentProps {
  config: ModelConfig;
}

export function ModelComponent({ config }: ModelComponentProps) {
  const model = useLoader(GLTFLoader, config.url) as GLTF;

  const position = useMemo(() => new Vector3(...(config.position ?? [0, 0, 0])), [config.position]);
  const shouldShow = config.show ?? true;

  if (!shouldShow) {
    return null;
  }

  return (
    <Select enabled={Boolean(config.highlight)}>
      <primitive object={model.scene} position={position} />
    </Select>
  );
}
