import React, { useState } from 'react'
import { Html } from '@react-three/drei'


export function AnnotationComponent(props) {

    const [showText, setShowText] = useState(false); //set true or false for default show hide, maybe add to Leva controls

    //Add or remove onLeave/click event as desired
    return (
        <Html position={props.transform} key={props.index}>
            <div className={showText? "annotation":"annotationHide"} 
                onClick={()=>{setShowText(false)}}>                
                    {props.name}
            </div>
            <button className={((props.highlight)? ' annotationHighlight' : 'annotationPoint')}
                    onClick={()=>{props.annotClick(props.index)}}
                    onMouseOver={()=>{setShowText(true)}}
                    onMouseLeave={()=>{setShowText(false)}}></button>
        </Html>
    );
}