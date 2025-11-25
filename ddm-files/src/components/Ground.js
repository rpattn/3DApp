import { RepeatWrapping, TextureLoader } from 'three'
import React, { useEffect, useState } from 'react'

export default function Ground({show}) {

    const textureLoader = new TextureLoader();
    const [texture, setTexture] = useState(null);

    useEffect(()=>{
        textureLoader.load('ground.jpg', (texture) => {
            texture.wrapS = texture.wrapT = RepeatWrapping;
            texture.repeat.set( 20, 20 );
            setTexture(texture);
        });
    },[])

    //const texture = useLoader(THREE.TextureLoader, img)

    return (
        ((texture && show)? 
        <mesh rotation-x={-Math.PI / 2} position-y={-55}>
            <planeGeometry attach="geometry" args={[10000, 10000]} />
            <meshBasicMaterial attach="material" map={texture}/>
        </mesh> : <></>
        )
    )
}