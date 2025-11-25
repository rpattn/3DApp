import React, { useEffect } from "react";

export default function SettingsComponent({ settingsData, setSettingsData, rootPoints, getSettingsObject }) {

    useEffect(() => {
        rootPoints.forEach((root) => {
            settingsData[root.name] = root.showModel
        })
    }, [rootPoints])

    return (
        <div className="settingsComponent">
            <details>
                <summary id="summaryBox"><p id="settings_text">Settings</p></summary>
                <div className="background">
                    <p className="settings_header">Model</p>
                    <ul>
                        {rootPoints.map((root, i) => {
                            if ((root.name !== "Empty") && (root.name !== "Root") && (root.name !== "TP Cover") && (root.name !== "TP Cover") && (root.name !== "Water")) {
                                return (
                                    <li key={i}><p>{root.name}</p>
                                        <div className="checkbox-wrapper-22">
                                            <div className='checkboxRow'>
                                                <label className="switch" htmlFor="checkbox">
                                                    <input type="checkbox" id={root.id}
                                                        checked={root.showModel}
                                                        onChange={(e) => { }} />
                                                    <div className="slider round" id={root.id}
                                                        onClick={(e) => { root.showModel = !root.showModel; setSettingsData(getSettingsObject(rootPoints)) }}></div>
                                                </label>
                                            </div>
                                        </div>
                                    </li>
                                )
                            }
                        })}
                    </ul>
                    
                    <p className="settings_header" style={{paddingTop: "10px"}}>Environment</p>
                    {rootPoints.map((root, i) => {
                        if ((root.name === "Water")) {
                            return (
                                <li key={i}><p>Model (Ocean)</p>
                                    <div className="checkbox-wrapper-22">
                                        <div className='checkboxRow'>
                                            <label className="switch" htmlFor="checkbox">
                                                <input type="checkbox" id={root.id}
                                                    checked={root.showModel}
                                                    onChange={(e) => { }} />
                                                <div className="slider round" id={root.id}
                                                    onClick={(e) => { root.showModel = !root.showModel; setSettingsData(getSettingsObject(rootPoints)) }}></div>
                                            </label>
                                        </div>
                                    </div>
                                </li>
                            )
                        }
                    })}
                    
                    <li><p>Background Intensity</p>
                        <input className="settings_input_num" type="number" value={settingsData["Background Intensity"]} step={0.05}
                            onChange={(e)=>{settingsData["Background Intensity"] = e.target.value; setSettingsData(settingsData)}}></input></li>
                    <li><p>Background Blur</p>
                        <input className="settings_input_num" type="number" value={settingsData["Background Blur"]} step={0.05}
                            onChange={(e)=>{settingsData["Background Blur"] = e.target.value; setSettingsData(settingsData)}}></input></li>
                    <li><p>Light Intensity</p>
                        <input className="settings_input_num" type="number" value={settingsData["Light Intensity"]} step={0.05}
                            onChange={(e)=>{settingsData["Light Intensity"] = e.target.value; setSettingsData(settingsData)}}></input></li>
                </div>
            </details>
        </div>
    )
}