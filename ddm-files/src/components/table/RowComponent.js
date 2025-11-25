import React from "react";
import shortid from "shortid";
//import { ROOT_POINTS } from "../../App";

export default function RowComponent({ row, itemClickFunction, className }) {
    return (
        <div className={className} {...row.getRowProps()} key={shortid.generate()}
            onClick={(e) => {
                //console.log(e.target);
                itemClickFunction(FindRootId(), row.original.__index, row.original.component, e, row.cells[2].value)
            }}>
            <div className="flexgrow1" {...row.cells[0].getCellProps()} key={shortid.generate()}>{row.cells[0].render('Cell')}</div>
            <div className="flexgrow1" {...row.cells[1].getCellProps()} key={shortid.generate()}>{row.cells[1].render('Cell')}</div>

            <div className="displayFlex flexgrow5" {...row.cells[2].getCellProps()} key={shortid.generate()}>
                <span>{row.cells[2].render('Cell')}</span>
                <span className="displayFlexImg">
                    {(row.cells[2].value !== " ")?
                    <div className="inspectionInfo">
                    <div className="infoicon"><p className="inspectionInfoClick">i</p></div>
                    <span className="inspectionInfoBox">
                        {PROCEDURE_LOOKUP[row.cells[2].value]}
                        <div className="inspectionInfoClick">More ...</div>
                    </span>
                    </div> : <></>}
                </span>
            </div>

            <div className="flexgrow5"  {...row.cells[3].getCellProps()} key={shortid.generate()}>{row.cells[3].render('Cell')}</div>
            <div className="flexgrow1"  {...row.cells[4].getCellProps()} key={shortid.generate()}>{row.cells[4].render('Cell')}</div>

        </div>
    )

    function FindRootId() {
        return row.original.component;
    }
}

const PROCEDURE_LOOKUP = {
    "GVI": "General visual inspection",
    "DVI": "Detailed visual inspection",
    "NDT": "Non-destructive testing",
    "MEP": "Measurement of electrochemical potential",
    "IPBC": "Inspection of preloaded bolted connection",
    "MGM": "Marine growth measurement",
    "EM": "Earthing inspection/maintenance"
}

