import React from "react";

export default function PageTabComponent({activeTab, index, togglePanelState, label}) {

    return (
        <div className="pageTab">
            <label className={(activeTab) ? "" : "active"} onClick={() => { togglePanelState(index) }}>{label} {(!activeTab) && "..."}</label>
        </div>
    )
}