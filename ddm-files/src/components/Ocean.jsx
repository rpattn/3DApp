import React, { useRef, useMemo, useState, useEffect } from 'react'
import { extend, useThree } from '@react-three/fiber'
import { Water } from 'three/examples/jsm/objects/Water2.js'
import { PlaneGeometry, RepeatWrapping, TextureLoader } from 'three'


extend({ Water })

export function Ocean({ position, show }) {
  const ref = useRef()
  const gl = useThree((state) => state.gl)
  const textureLoader = new TextureLoader();
  const [waterNormals, setWaterNormals] = useState();

  useEffect(() => {
    textureLoader.load('waternormals.jpeg', (texture) => {
      let waterNormalsTemp = texture;
      waterNormalsTemp.wrapS = waterNormalsTemp.wrapT = RepeatWrapping;
      setWaterNormals(waterNormalsTemp);
    })
  }, [])

  const geom = useMemo(() => new PlaneGeometry(10000, 10000), [])
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
      encoding: gl.encoding,
      color: 0xbbbbbb
    }),
    [waterNormals]
  )

  return (
    <>
        {waterNormals && show &&
        <water ref={ref} args={[geom, config]} rotation-x={-Math.PI / 2} position={position} />}
    </>
  )
}