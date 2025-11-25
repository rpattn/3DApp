import React from "react";
import shortid from "shortid";
import ColumnHeaderComponent from "./ColumnHeaderComponent";

export default function HeaderComponent({ headerGroup }) {
    return (
        <div className='tableRow' {...headerGroup.getHeaderGroupProps()} key={shortid.generate()}>
            <ColumnHeaderComponent column={headerGroup.headers[0]} />
            <ColumnHeaderComponent column={headerGroup.headers[1]} />
            <ColumnHeaderComponent column={headerGroup.headers[2]} />
            <ColumnHeaderComponent column={headerGroup.headers[3]} />
            <ColumnHeaderComponent column={headerGroup.headers[4]} />
        </div>
    )
}