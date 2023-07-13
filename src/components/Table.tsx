import { CoolerLP } from "@/types"
import { css } from "@emotion/react"
import { useRouter } from "next/router"
import Link from "next/link"
import { ArrowUp, ArrowDown } from "tabler-icons-react"
import { compareValues } from "@/utils/compareValues"
import { MouseEvent } from "react"
import { parseQueryString } from "@/utils/queryString/parseQueryString"
import { getOptions } from "@/utils/getOptions"
import FilterControls from "./Sidebar"
import { DeserializedFilters } from "@/utils/queryString/deserializeFilters"
import { Range } from "@/utils/queryString/range"
import Sidebar from "./Sidebar"



/**
 * Check if a row satisfies the filters.
 * Return false if any filter is not empty and
 * the row does not have any of the required values.
 * Otherwise return true.
 * @param row 
 * @param filters 
 * @param header 
 * @returns 
 */
function filterRow(row: Record<string,string|number>, filters: DeserializedFilters) {
    /*
    fil = {
        0: [1,2],
        3: [10,11],
    }
    */

    for(const [key,allowedValues] of Object.entries(filters)) {

        if(allowedValues.length > 0) {
            const rowValue = row[key]
            if(allowedValues.indexOf(rowValue) < 0) {
                return false
            }
        }
    }
    
    return true
}


/**
 * Check all columns of a row to see if the are within a certain range (min-max).
 * Returns false if any of the values are outside the range.
 * Also returns false if a value is a string, and "includeUnknown" is false.
 * Otherwise returns true.
 * @param row 
 * @param ranges 
 * @returns 
 */
function filterRowByRange(row: Record<string,string|number>, ranges: Record<string,Range>) {
    
    for(const [optionLabel, { min,max,includeUnknown }] of Object.entries(ranges)) {

        const rowValue = row[optionLabel]

        if(typeof rowValue === "string") {
            if(!includeUnknown) {
                return false
            }
        }
        else if(rowValue < min || rowValue > max) {
            return false
        }
    }
    return true
}


type Props = {
    rows: Partial<CoolerLP>[],
}

export default function Table({ rows }: Props) {

    const header = Object.keys(rows[0])

    // Get filters and sorting from query string
    const router = useRouter()

    const options = getOptions(rows)

    const query = parseQueryString(router.query, options)

    // console.log(query)


    const sortKey = Object.values(header)[query.col] as keyof CoolerLP

    const sortedRows = rows
        .filter(row => filterRow(row, query.fil))
        .filter(row => filterRowByRange(row, query.r))
        .sort((a,b) => {
            return compareValues(a[sortKey], b[sortKey], query.asc)
        })

    // console.log({ asc: sort.asc, col: sort.col, sortKey })
    // console.log(sortedRows)

    // The URL is replaced with JS instead of using the actual anchor.
    // This way we prevent losing the scroll position.
    function handleHeaderClick(e: MouseEvent<HTMLAnchorElement>, newQuery: Record<string,string|number|boolean>) {
        e.preventDefault()
        // console.log({ newQuery })
        router.replace({
            query: newQuery,
        })
    }

    return (
        <div className="container" css={ style }>

            <Sidebar query={ query } options={ options }/>
            
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            {
                                header.map((label,i) => {

                                    const newQuery: Record<string,string|number|boolean> = {
                                        ...router.query,
                                        asc: query.col===i ? !query.asc : query.asc,
                                        col: i,
                                        // fil: stringifyFilters(query.fil),
                                    }
                                    // if(typeof router.query?.fil === "string") {
                                    //     newQuery.fil = router.query.fil
                                    // }

                                    return <th key={ i } data-active={ query.col===i }>
                                        <Link
                                            href={{ query: newQuery }}
                                            replace={ true }
                                            onClick={(e) => handleHeaderClick(e, newQuery)}
                                        >
                                            <span>{ label }</span>
                                            {
                                                query.col===i &&
                                                (query.asc ? <ArrowDown/> : <ArrowUp/>)
                                            }
                                        </Link>
                                    </th>
                                })
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            sortedRows.map((row,i) => (
                                <tr key={ i }>
                                    {
                                        Object.values(row).map((value,j) => (
                                            <td key={ j }>{ value || "-" }</td>
                                        ))
                                    }
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const style = css`

    width: 100%;
    /* overflow-x: auto; */
    display: grid;
    grid-template-columns: 25rem 1fr;
    position: absolute;
    width: 100%;
    height: 100%;

    .table-container {
        overflow: auto;

        table {
            border-collapse: collapse;
            width: 100%;
    
            th, td {
                border: 1px solid #ddd;
                padding: 0 5px;
            }
            th[data-active=true] {
                color: dodgerblue;
            }
            td {
                height: 1.5em;
            }
            
            a {
                text-decoration: none;
                color: inherit;
                font-weight: 600;
            }
        }
    }

`