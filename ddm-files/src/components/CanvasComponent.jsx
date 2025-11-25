// NavBar.js
import React, { useEffect, useState, useRef } from 'react';
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, PerspectiveCamera, Sky } from "@react-three/drei";
import { Suspense } from "react";
import { Ocean } from "./Ocean";
import { Annotations } from './Annotations';
import { AnnotationComponent } from './AnnotationComponent';
import { Vector3 } from 'three';
import { ModelManager } from './ModelManager';
import JEASINGS from 'jeasings';
import Ground from './Ground';
//import WaterPlane from './WaterPlane';
//Get more sky options like above from https://polyhaven.com/a/autumn_field_puresky
//import bg from '../../assets/industrial_sunset_puresky_4k.hdr';
//import bg from '../../assets/kloppenheim_06_puresky_1k.hdr'  
//src\assets\lonely_road_afternoon_puresky_4k.hdr; 
//import bg from '../../assets/table_mountain_1_puresky_4k.hdr'  
//import bg from '../../assets/lonely_road_afternoon_puresky_4k.hdr'  

//Use sky or environment
const useSky = true;

const CanvasComponent = (props) => {                                  //props {rootConfig, allPoints} to pass to model manager

    const [annotIndicies, setAnnotIndicies] = useState([0]);
    const [rootDataPoints, setRootDataPoints] = useState(props.rootPoints);
    const [myAnot, setMyAnot] = useState(new Vector3(-100000, 100000, 10000));

    const cameraRef = useRef(null);
    const controlsRef = useRef(null);

    useEffect(() => {
        setAnnotIndicies(props.anots)
        setRootDataPoints(props.rootPoints)
        setMyAnot(new Vector3(-100000, 100000, 10000));
    }, [props.anots, props.rootPoints])

    useEffect(() => {
        //console.log(props.cameraPos)
        if ((controlsRef.current !== null) && (cameraRef.current !== null)) {
            setTimeout(() => { moveCamera(controlsRef, cameraRef, props.cameraPos) }, 100)
        }
    }, [props.cameraPos])
    
    useEffect(() => {
        //console.log(props.settings)
    }, [props.settings])


    function clickHandler(event) {

        if (event.ctrlKey) {
            //setMyAnot(event.point);
            //props.setAnnotationPoint(event.point)
            console.log(cameraRef.current.position)
        }
    }

    //                <WTGModelComponent rootPoints={rootDataPoints} allPoints={props.allPoints} clickHandler={clickHandler} />

    return (
        <div className='w-full h-full' >
        <Canvas id="canvas" gl={{ preserveDrawingBuffer: true }} dpr={[1, 1.5]} onClick={clickHandler} >
            <PerspectiveCamera ref={cameraRef} makeDefault position={[50, 15, 0]} fov={50} far={10000} ></PerspectiveCamera>
            <JEasings />
            <Suspense fallback={null}>
                <ModelManager rootPoints={rootDataPoints} allPoints={props.allPoints} clickHandler={clickHandler} modelToHighlight={props.modelToHighlight} />
                <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.2} />
                
                <Environment
                    files={'autumn_field_puresky_4k.hdr'}
                    backgroundBlurriness={props.settings["Background Blur"]}
                    blur={props.settings["Background Blur"]}
                    environmentIntensity={props.settings["Background Intensity"]}
                    backgroundIntensity={props.settings["Background Intensity"]}
                    background />
                
                {useSky? 
                <Sky distance={45000} sunPosition={[1000, 1000, 0]} inclination={10} azimuth={5}
                    mieCoefficient={0.05} mieDirectionalG={10} rayleigh={0.7} turbidity={1} /> : <></>}

                    <Ocean position={[0, -10, 0]} speed={props.settings["Water Speed"]} show={props.rootPoints[4].showModel}/>
                    <Ground show={props.rootPoints[4].showModel} />
            </Suspense>
            <ambientLight intensity={(props.settings["Light Intensity"] / 2 )} />
            <Annotations annotIndicies={annotIndicies} annotClick={props.annotClickFunc} allPoints={props.allPoints} />
            <AnnotationComponent
                annotClick={() => { console.log([myAnot.x, myAnot.y, myAnot.z]); setMyAnot(new Vector3(-100000, 100000, 10000)); }}
                transform={[myAnot.x, myAnot.y, myAnot.z]}
                name={"User Point"} />
        </Canvas>
        </div>
    );
}

export default CanvasComponent;


function JEasings() {
    useFrame(() => {
        JEASINGS.update()
    })
}

const moveCamera = (controls, camera, position) => {
    let zoom = position[3];
    // change target
    new JEASINGS.JEasing(controls.current.target)
        .to(
            {
                x: position[4],
                y: position[5],
                z: position[6]
            },
            2000
        )
        .easing(JEASINGS.Cubic.Out)
        .start()

    // change camera position
    new JEASINGS.JEasing(camera.current.position)
        .to(
            {
                x: position[0] * zoom,
                y: position[1] * zoom,
                z: position[2] * zoom
            },
            2000
        )
        .easing(JEASINGS.Cubic.Out)
        .start()
}

//<WaterPlane show={props.rootPoints[4].showModel} />