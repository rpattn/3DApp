import React, { useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import { Select } from '@react-three/postprocessing';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Object3D, Vector3 } from 'three';

export function buildAssetUrl(basePath: string, relativePath: string) {
  const normalizedBase = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
  return `${normalizedBase}/${relativePath.replace(/^\//, '')}`;
}

export type ModelConfig = {
  name: string;
  /**
   * Relative path to the GLB/GLTF model from the provided asset base path.
   */
  url: string;
  position?: [number, number, number];
  show?: boolean;
  highlight?: boolean;
};

interface ModelComponentProps {
  config: ModelConfig;
  assetBasePath: string;
}

export function ModelComponent({ config, assetBasePath }: ModelComponentProps) {
  const modelUrl = useMemo(() => buildAssetUrl(assetBasePath, config.url), [assetBasePath, config.url]);
  const model = useLoader(GLTFLoader, modelUrl) as GLTF;

  const position = useMemo(() => new Vector3(...(config.position ?? [0, 0, 0])), [config.position]);
  const shouldShow = config.show ?? true;

  if (!shouldShow) {
    return null;
  }

  return (
    <Select enabled={Boolean(config.highlight)}>
      <primitive
        object={model.scene}
        onUpdate={(obj: Object3D) => {
          obj.position.set(position.x, position.y - 50, position.z);
        }}
        position={position}
      />
    </Select>
  );
}
