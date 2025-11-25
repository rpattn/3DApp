"use client"

import React, { lazy, Suspense, useState } from "react";
import { useEffect } from 'react';
import { useDataContext } from "./DataContext";
import CanvasComponent from "./CanvasComponent";
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import PageTabComponent from './PageTabComponent';
import InspectionPlanTableManager from "./table/InspectionPlanTableManager";
import SettingsComponent from "./SettingsComponent";
const ManualPage = lazy(() => import('./ManualPage'));


export default function InspectionPage() {

    const data = useDataContext()

    const [inspectionData, setInspectionData] = useState(data.data.inspData); //Data to show in table

    const [allDataPoints, setAllDataPoints] = useState(data.data.allPoints) //Stateful copy of "allPoints" so we can toggle annotations on/off
    const [rootDataPoints, setRootDataPoints] = useState(data.data.rootPoints) //Stateful copy of "rootPoints" so we can toggle root model visibility
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [anots, setAnots] = useState(getAnotsArray()) //An array [] of indicies maping to allPoints for annotation child comp

    const [panelStates, setPanelStates] = useState([true, true, false, false]) //Model window, Inspection Table, Details view and Contents View visibility state
    
    const [modelToHighlight, setModelToHighlight] = useState(0);
    const [detailIndex, setDetailIndex] = useState(0);
    const [detailName, setDetailName] = useState(null);
    const [cameraPos, setCameraPos] = useState([50, 15, 0])

    //const showData = useControls(getSettingsObject())
    const [settingsData, setSettingsData] = useState(getSettingsObject(rootDataPoints))

    //Get an array [] of indicies mapping to allPoints
    useEffect(() => { setAnots(getAnotsArray()) }, [allDataPoints])

    useEffect(() => {
        rootDataPoints.forEach(root => {
            root.showModel = settingsData[root.name]
        });
        setRootDataPoints([...rootDataPoints])
    }, [settingsData])

    function tableRowClicked(_id, tableRowIndex, name, e, detailName) {
        console.log(selectedRowIndex)
        let id = data.data.rootPoints.find(val => val.name === _id).id
        //setCameraPos([50, 25, 0, 0.5])
        let clickedElem = e.target;
        if(clickedElem) {
            if((clickedElem.className === "inspectionInfoBox") || (clickedElem.className === "inspectionInfo") || (clickedElem.className === "inspectionInfoClick")){
                setDetailIndex(17)
                if(!panelStates[2]){togglePanelState(2)}
                setDetailName(detailName)
                return;
            }
        }
        //Loop through root data points to find the index of the model to highlight on/off
        for (let index = 0; index < rootDataPoints.length; index++) {
            const root = rootDataPoints[index];
            if (root.id === id) {
                inspectionData.forEach((item) => {
                    if (item.__index === tableRowIndex) {
                        if (item.highlightModel === undefined) {
                            setModelToHighlight(index)
                            setDetailIndex(index)
                            showModel(root.id, true)
                            if(root.cameraPos !== undefined) {
                                setCameraPos([...root.cameraPos, ...root.lookAt])
                            }
                        } else {
                            setModelToHighlight(0)
                            setDetailIndex(0)
                        }
                    }
                })

            }
        }
        if((name === "Extension Ladder") && (detailIndex !== 15)){
            setDetailIndex(15)
        } else if ((name === "MP-TP Flange Connection ") && (detailIndex !== 16)){
            setDetailIndex(16)
            setCameraPos([28.633271666270257, 3.7114332527695417, 0.24879492545630638, 1, 0,-3,0])
        }
        //If the table row has specific annotation point data, then show annotation on, else set all points off
        inspectionData.forEach(row => {
            if (row.ownAnnotations !== undefined) {
                row.ownAnnotations.forEach(anotIndex => {
                    let showPoint = false;
                    if ((tableRowIndex === row.__index) && (selectedRowIndex !== tableRowIndex)) { showPoint = true }
                    allDataPoints[anotIndex].showAnnotation = showPoint;
                })
            }

        })
        //Update or toggle our selected row index
        if (selectedRowIndex !== tableRowIndex) {
            setSelectedRowIndex(tableRowIndex)
            if(!panelStates[2]){
                panelStates[2] = true; 
                setPanelStates([...panelStates])
            }
        } else {
            setSelectedRowIndex(null)
            showModel(0, false)
            setModelToHighlight(0)
            setDetailIndex(0)
            setCameraPos([37, 20, 1, 1, 0,7,0])
        }
        if(name === "MP-TP Flange Connection ")  {
            showModel(0, true, [2,3])
        }
        setAllDataPoints(JSON.parse(JSON.stringify(allDataPoints)))
    }

    //Get an array [] of indicies mapping to allPoints
    function getAnotsArray() {
        let anotsArray = []

        let inspectionDataIndex = getInspectionDataIndex();  //Index of current selected row
        if (inspectionDataIndex === null) { return [] }
        if (inspectionData[inspectionDataIndex].ownAnnotations !== undefined) {
            inspectionData[inspectionDataIndex].ownAnnotations.forEach(index => {
                anotsArray.push(index)
            })
        }
        return anotsArray;
    }

    function annotClickFunc(annotIndex) {
        console.log(annotIndex)
    }

    function getInspectionDataIndex() {
        let i = null;
        for (let index = 0; index < inspectionData.length; index++) {
            const line = inspectionData[index];
            if (line.__index === selectedRowIndex) {
                i = index;
            }
        }
        return i;
    }

    function showModel(id, hideAll, manualRootIndexes) {
        let otherModelsToShow = []
        rootDataPoints.forEach((root)=>{
            if(parseInt(root.id) === parseInt(id)){
                root.showModel = true
                if(root.showWithArray !== undefined) {
                    otherModelsToShow = root.showWithArray;
                }
            } else {
                root.showModel = !hideAll
            }
        })
        otherModelsToShow.forEach((index)=>{rootDataPoints[index].showModel=true})

        if(manualRootIndexes !== undefined) {
            manualRootIndexes.forEach(index => {rootDataPoints[index].showModel=true})
        }
        setRootDataPoints([...rootDataPoints])
    }

    function getSettingsObject(data) {
        let modelSettings = {};
        data.forEach((root) => {
            if ((root.name !== "Empty") && (root.name !== "Root") && (root.name !== "TP Cover") ) {
                modelSettings[root.name] = root.showModel
            }
        })

        //modelSettings["Water"] = true;
        modelSettings["Background Intensity"] = 0.4;
        modelSettings["Light Intensity"] = 1;
        modelSettings["Background Blur"] = 0.1; 
        return modelSettings;
    }

    function togglePanelState(i) {
        /*if(i===1){
            setDetailIndex(0)
            setModelToHighlight(0)
            setSelectedRowIndex(null)
        }*/
        panelStates[i] = !panelStates[i]
        setPanelStates([...panelStates])
    }

    function showManualTab() {
        return (detailIndex === 0);
    }

    function setSettingsDataFunc(settings) {
        console.log(settings)
        setSettingsData(JSON.parse(JSON.stringify(settings)))
    }

    useEffect(() => {
        console.log("Manual got: ", data)
    }, [data])

    return (
        <div className="w-full h-full pt-10">
            {(!panelStates[0] && !panelStates[1] && !panelStates[2]) ? <>
                <div className='pageTabs'>
                    <PageTabComponent label="Model Window" activeTab={panelStates[0]} index={0} togglePanelState={togglePanelState} />
                    <PageTabComponent label="Inspection Plan" activeTab={panelStates[1]} index={1} togglePanelState={togglePanelState} />
                    <PageTabComponent label={(showManualTab()) ? "O&M Manual" : "Details"} activeTab={panelStates[2]} index={2} togglePanelState={togglePanelState} />
                </div>
            </> : <div className='pageTabs'></div>}
            <PanelGroup direction="horizontal">
                <Panel id="settings" minSize={10} defaultSize={30} order={1}
                    onCollapse={() => { togglePanelState(0) }}
                    className={(panelStates[0]) ? "panel animate" : "panel animate hiddenPanel"}>
                    <div className='pageTab'>
                        <PageTabComponent label="Model Window" activeTab={panelStates[0]} index={0} togglePanelState={togglePanelState} />
                        {(!panelStates[1]) ?
                            <PageTabComponent label="Inspection Plan" activeTab={panelStates[1]} index={1} togglePanelState={togglePanelState} /> : <></>}
                        {(!panelStates[1] && (!panelStates[2])) ?
                            <PageTabComponent label={(showManualTab()) ? "O&M Manual" : "Details"} activeTab={panelStates[2]} index={2} togglePanelState={togglePanelState} /> : <></>}
                    </div>
                    <div className='settingsPanel'>
                        <SettingsComponent settingsData={settingsData} setSettingsData={setSettingsDataFunc} rootPoints={rootDataPoints} getSettingsObject={getSettingsObject} />
                    </div>
                    <div className='canvas'>
                    {((rootDataPoints.length > 0) && (allDataPoints.length > 0) && (modelToHighlight !== null)) ?
                            <CanvasComponent
                                rootPoints={rootDataPoints}
                                anots={anots}
                                allPoints={allDataPoints}
                                annotClickFunc={annotClickFunc}
                                setAnnotationPoint={() => { }}
                                modelToHighlight={modelToHighlight}
                                settings={settingsData}
                                cameraPos={cameraPos} /> : <>Loading...</>}
                    </div>
                </Panel>

                <PanelResizeHandle />

                <Panel minSize={25} defaultSize={60} order={2}
                    className={(panelStates[1]) ? "panel animate" : "panel animate hiddenPanel"}
                    onCollapse={() => { togglePanelState(1) }}>
                    <div className='pageTab'>
                        {(!panelStates[0]) ?
                            <PageTabComponent label="Model Window" activeTab={panelStates[0]} index={0} togglePanelState={togglePanelState} /> : <></>}
                        <PageTabComponent label="Inspection Plan" activeTab={panelStates[1]} index={1} togglePanelState={togglePanelState} />
                        {(!panelStates[2]) ?
                            <PageTabComponent label={(showManualTab()) ? "O&M Manual" : "Details"} activeTab={panelStates[2]} index={2} togglePanelState={togglePanelState} /> : <></>}
                    </div>
                    <div className='card' style={{ boxShadow: "none" }}>
                        <div className='card scrollWindow'>
                            <div className='inspectionTable'>
                                <InspectionPlanTableManager inspectionData={data.data.inspData} itemClickFunction={tableRowClicked}
                                    selectedRowIndex={selectedRowIndex} />
                            </div>
                        </div>
                    </div>
                </Panel>
                <PanelResizeHandle />

                <Panel minSize={25} defaultSize={30} order={3}
                    className={(panelStates[2]) ? "panel animate" : "panel animate hiddenPanel"}
                    onCollapse={() => { togglePanelState(2) }}>
                    <div className='pageTab'>
                        {(!panelStates[0] && (!panelStates[1])) ? <>
                            <PageTabComponent label="Model Window" activeTab={panelStates[0]} index={0} togglePanelState={togglePanelState} />
                            <PageTabComponent label="Inspection Plan" activeTab={panelStates[1]} index={1} togglePanelState={togglePanelState} />
                        </> : <></>}
                        <PageTabComponent label={(showManualTab()) ? "O&M Manual" : "Details"} activeTab={panelStates[2]} index={2} togglePanelState={togglePanelState} />
                        {(panelStates[0] || (panelStates[1])) && (showManualTab()) ?
                            <PageTabComponent label="Contents" activeTab={panelStates[3]} index={3} togglePanelState={togglePanelState} />
                            : <></>}
                    </div>
                    <div className='card' style={{ paddingBottom: "0px", boxShadow: "none" }}>
                        <div className='card scrollWindow'>
                            <Suspense fallback={<div>Loading...</div>}>
                                {(panelStates[2]) && <ManualPage />}
                            </Suspense>
                        </div>
                    </div>
                </Panel>
            </PanelGroup>
        </div>
    );
}
