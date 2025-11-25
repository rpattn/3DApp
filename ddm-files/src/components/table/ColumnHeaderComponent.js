import React from "react";

export default function ColumnHeaderComponent({ column }) {
    return (
        <div {...column.getHeaderProps()}>
            <div {...column.getHeaderProps(column.getSortByToggleProps())}>{column.render('Header')}</div>
            <span>{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
            {/* Render the columns filter UI */}
            <div
                {...column.getResizerProps()}
                className={`resizer ${column.isResizing ? 'isResizing' : ''
                    }`}
            />
            <div>{column.canFilter ? column.render('Filter') : null}</div>
        </div>

    )
}