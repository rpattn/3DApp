import React from 'react';
import { useBlockLayout, useExpanded, useFilters, useFlexLayout, usePagination, useResizeColumns, useSortBy, useTable } from 'react-table'
import shortid from 'shortid';
import RowComponent from './RowComponent';
import { fuzzyTextFilterFn } from './InspectionPlanTableManager';
import HeaderComponent from './HeaderComponent';
import './InspectionPlanTable.css'

export default function InspectionPlanTable({ data, columns, itemClickFunction, updateMyData, selectedRowIndex }) {

    const filterTypes = React.useMemo(
        () => ({
            fuzzyText: fuzzyTextFilterFn,
            // Or, override the default text filter to use
            // "startWith"
            text: (rows, id, filterValue) => {
                return rows.filter(row => {
                    const rowValue = row.values[id]
                    return rowValue !== undefined
                        ? String(rowValue)
                            .toLowerCase()
                            .startsWith(String(filterValue).toLowerCase())
                        : true
                })
            },
        }),
        []
    )

    const defaultColumn = React.useMemo(
        () => ({
            // Let's set up our default Filter UI
            Filter: DefaultColumnFilter,
            // And also our default editable cell
            Cell: EditableCell,

        }),
        []
    )

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        pageOptions,
        pageCount,
        page,
        state: {
            pageIndex,
            pageSize,
          },
          gotoPage,
          previousPage,
          nextPage,
          setPageSize,
          canPreviousPage,
          canNextPage
    } = useTable({ columns, data, initialState: {pageIndex: 0, pageSize: 20}, defaultColumn, filterTypes, updateMyData, autoResetSortBy: false }, 
        useFilters, useBlockLayout, useResizeColumns, useSortBy, useExpanded, usePagination, useFlexLayout)

    return (
        <div>
        <div {...getTableProps()} key={shortid.generate()}>
            <div {...getTableBodyProps()} key={shortid.generate()} style={{display: "flex", flexDirection: "column"}}>

                <HeaderComponent headerGroup={headerGroups[0]} />

                {page.map((row, i) => {
                    prepareRow(row)
                    return (
                        <RowComponent 
                            className={(row.original.__index === selectedRowIndex)? "selectedRow hoverRow" : "inspectionTableRow hoverRow"} 
                            row={row} itemClickFunction={itemClickFunction} />
                    )
                })}
            </div>
        </div>
        <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      </div>
    );
}






///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Create an editable cell renderer
const EditableCell = ({
    value: initialValue,
    row: { index },
    column: { id },
    updateMyData, // This is a custom function that we supplied to our table instance
    editable,
}) => {
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue)

    const onChange = e => {
        setValue(e.target.value)
    }

    // We'll only update the external data when the input is blurred
    const onBlur = () => {
        updateMyData(index, id, value)
    }

    // If the initialValue is changed externall, sync it up with our state
    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    if (!editable) {
        return `${initialValue}`
    }

    return <input value={value} onChange={onChange} onBlur={onBlur} />
}

// Define a default UI for filtering
function DefaultColumnFilter({
    column: { filterValue, preFilteredRows, setFilter },
}) {
    const count = preFilteredRows.length

    return (
        <input
            value={filterValue || ''}
            onChange={e => {
                setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
            }}
            placeholder={`Search ${count} records...`}
        />
    )
}

