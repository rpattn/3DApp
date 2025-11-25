import React, { useEffect, useMemo, useRef, useState } from 'react';
import { extend, Object3DNode, useThree } from '@react-three/fiber';
import { PlaneGeometry, RepeatWrapping, TextureLoader } from 'three';
import { Water } from 'three/examples/jsm/objects/Water2.js';
import { buildAssetUrl } from './ModelComponent';

extend({ Water });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      water: Object3DNode<Water, typeof Water>;
    }
  }
}

interface OceanProps {
  position: [number, number, number];
  assetBasePath: string;
  show?: boolean;
}

export function Ocean({ position, assetBasePath, show = true }: OceanProps) {
  const ref = useRef<any>();
  const gl = useThree((state) => state.gl);
  const textureLoader = useMemo(() => new TextureLoader(), []);
  const [waterNormals, setWaterNormals] = useState<any>();

  useEffect(() => {
    textureLoader.load(buildAssetUrl(assetBasePath, 'public/waternormals.jpeg'), (texture) => {
      const loadedNormals = texture;
      loadedNormals.wrapS = RepeatWrapping;
      loadedNormals.wrapT = RepeatWrapping;
      setWaterNormals(loadedNormals);
    });
  }, [assetBasePath, textureLoader]);

  const geom = useMemo(() => new PlaneGeometry(10000, 10000), []);
  const config = useMemo(
    () => ({
      textureWidth: 256,
      textureHeight: 256,
      clipBias: 0,
      flowSpeed: 0.05,
      reflectivity: 0.4,
      scale: 100,
      flowMap: waterNormals,
      normalMap0: waterNormals,
      normalMap1: waterNormals,
      encoding: (gl as any).outputEncoding ?? (gl as any).outputColorSpace,
      color: 0xbbbbbb,
    }),
    [gl, waterNormals]
  );

  if (!waterNormals || !show) {
    return null;
  }

  return <water ref={ref} args={[geom, config]} rotation-x={-Math.PI / 2} position={position} />;
}
