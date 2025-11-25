"use client"

import React, { useEffect, useState } from 'react'
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Select } from '@react-three/postprocessing';
import { useDataContext } from './DataContext';

export function ModelComponent({conf}) {

    const data = useDataContext()

    const model = useLoader(GLTFLoader, "/api/getModel?url=" + data.resourcePath + conf.model);
    
    const [myModel, setMyModel] = useState(null);

    useEffect(()=> {
        setTransform()
        setMyModel(model)
    },[model])   

    function setTransform() {
        model.scene.position.y = -50;
    }

    return (
        (conf.show && myModel !== null)?
        <Select enabled={conf.highlight}>
            <primitive 
                object={myModel.scene} 
                key={conf.name} 
            />
        </Select>
        : <></>
    )
}