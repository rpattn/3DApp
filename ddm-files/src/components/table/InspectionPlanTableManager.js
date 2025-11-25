import React, { useEffect, useMemo, useRef, useState } from 'react';
import InspectionPlanTable from './InspectionPlanTable';
import { matchSorter } from 'match-sorter';


export default function InspectionPlanTableManager(props) {

    const [data, setData] = useState((props.inspectionData)? [...props.inspectionData] : []);

    const skipResetRef = useRef(false)

    const updateMyData = (rowIndex, columnId, value) => {
        // We also turn on the flag to not reset the page
        skipResetRef.current = true
        setData(old =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...row,
                [columnId]: value,
              }
            }
            return row
          })
        )
      }

      useEffect(() => {
        skipResetRef.current = false
      }, [data])

      useEffect(() => {
        if(props.inspectionData) {
        setData([...props.inspectionData])
        }
      }, [props.inspectionData])

    const columns = useMemo(()=>[
        {
            Header: "Component", accessor: "component", width: 70, maxWidth: 200, minWidth: 50, align: 'right', Filter: SelectColumnFilter, filter: 'includes',
        },
        {
            Header: "Detail", accessor: "componentDetail", width: 70, maxWidth: 200, minWidth: 50, align: 'right', Filter: SelectColumnFilter, filter: 'includes',
        },
        {
            Header: "Procedure", accessor: "procedure", width: 75, maxWidth: 200, minWidth: 50, align: 'right', Filter: SelectColumnFilter, filter: 'includes',
        },
        {
            Header: "Acceptance criteria", accessor: "acceptance", width: 240, maxWidth: 350, minWidth: 100, align: 'right', disableFilters: true
        },
        {
            Header: "Interval", accessor: "interval", width: 150, maxWidth: 200, minWidth: 50, align: 'right', Filter: SelectColumnFilter, filter: 'includes',
        },
    ],[])

    return (
       <InspectionPlanTable data={data} columns={columns} itemClickFunction={props.itemClickFunction} updateMyData={updateMyData} 
       skipReset={skipResetRef.current} selectedRowIndex={props.selectedRowIndex}/>
    );
}

function SelectColumnFilter({
    column: { filterValue, setFilter, preFilteredRows, id },
}) {
    // Calculate the options for filtering
    // using the preFilteredRows
    const options = React.useMemo(() => {
        const options = new Set()
        preFilteredRows.forEach(row => {
            options.add(row.values[id])
        })
        return [...options.values()]
    }, [id, preFilteredRows])

    // Render a multi-select box
    return (
        <select
            value={filterValue}
            onChange={e => {
                setFilter(e.target.value || undefined)
            }}
        >
            <option value="">All</option>
            {options.map((option, i) => (
                <option key={i} value={option}>
                    {option}
                </option>
            ))}
        </select>
    )
}

export function fuzzyTextFilterFn(rows, id, filterValue) {
    return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
  }
  
  // Let the table remove the filter if the string is empty
  fuzzyTextFilterFn.autoRemove = val => !val