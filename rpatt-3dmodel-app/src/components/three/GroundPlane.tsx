import React, { useEffect, useMemo } from 'react';
import { RepeatWrapping, TextureLoader } from 'three';
import { useLoader } from '@react-three/fiber';
import { buildAssetUrl } from './ModelComponent';

interface GroundPlaneProps {
  assetBasePath: string;
  show?: boolean;
}

export function GroundPlane({ assetBasePath, show = true }: GroundPlaneProps) {
  const textureUrl = useMemo(() => buildAssetUrl(assetBasePath, 'public/ground.jpg'), [assetBasePath]);
  const texture = useLoader(TextureLoader, textureUrl);

  useEffect(() => {
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(20, 20);
  }, [texture]);

  if (!show) {
    return null;
  }

  return (
    <mesh rotation-x={-Math.PI / 2} position-y={-55}>
      <planeGeometry args={[10000, 10000]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}
