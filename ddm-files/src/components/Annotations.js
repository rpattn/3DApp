import React, { useEffect, useState } from 'react'
import { AnnotationComponent } from './AnnotationComponent';


export function Annotations(props) {

    const [anots, setAnots] = useState();

    useEffect(() => {
        setAnots(getAnots())
        //console.log(props)
    }, [props.annotIndicies])


    function getAnots() {//<div className="annotation">{name}</div>
        let jsx = [];
        let orderedAnotIndicies = props.annotIndicies.sort((a, b) => a - b);
        for (let i = 0; i < orderedAnotIndicies.length; i++) {
            const index = orderedAnotIndicies[i];
            const anot = props.allPoints[index];
            let name = anot.info[anot.info.length - 1];
            if (anot.annotationText !== undefined) { name = name + ": " + anot.annotationText }
            jsx.push(
                <AnnotationComponent key={index}
                    annotClick={props.annotClick}
                    transform={[anot.transform[0], anot.transform[1], anot.transform[2]]}
                    index={index}
                    name={name} />)
        }
        return jsx;
    }

    return (
        <>
            {anots}
        </>
    );
}