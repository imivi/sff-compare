import { Query } from "@/utils/queryString/query"
import { useRouter } from "next/router"
import Button from "../utility/Button"
import { Row } from "@/data"
import { css } from "@emotion/react"
import { DeserializedFilters } from "@/utils/queryString/deserializeFilters"
import { Range } from "@/utils/queryString/range"
import { compareValues } from "@/utils/compareValues"
import { CoolerLP } from "@/types"
import { MouseEvent } from "react"
import Link from "next/link"
import { ArrowDown, ArrowUp } from "tabler-icons-react"
import Checkbox from "../utility/Checkbox"



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
    query: Query
    rows: Row[]
    header: string[]
}

export default function Table2({ query, rows, header }: Props) {

    const router = useRouter()

    
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
        <div css={ style }>
            <table>
                <thead>
                    <tr>

                        <th>
                            <span>Compare</span>
                            {
                                query.compareCount() > 0 &&
                                <Button onClick={ () => {
                                    router.replace({
                                        query: {
                                            ...router.query,
                                            c: query.clearCompare().stringifyCompare(),
                                        }
                                    })
                                }}>clear</Button>
                            }
                        </th>

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
                                        <span className="icon-sort-arrow">
                                            { query.asc ? <ArrowDown/> : <ArrowUp/> }
                                        </span>
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
                                <td>
                                    <Checkbox
                                        checked={ query.hasRowId(row.id) }
                                        onChange={ () => {
                                            router.replace({
                                                query: {
                                                    ...router.query,
                                                    c: query.toggleCompare(row.id).stringifyCompare(),
                                                }
                                            })
                                        }}
                                    />
                                </td>
                                {
                                    header.map((key,j) => (
                                        <td key={ j }>{ row[key] || "-" }</td>
                                    ))
                                }
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}


const style = css`
    overflow: auto;

    table {
        border-collapse: collapse;
        width: 100%;

        thead {
            position: sticky;
            z-index: 1;
            inset-block-start: 0; // top
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }

        th {
            background-color: #e8eff5;
            /* border: 1px solid #afd0ec; */
            padding: 5px;
            position: relative;

            /* This is a hack to add a cell border on a sticky header */
            &::after {
                outline: 1px solid #afd0ec;
                position: absolute;
                width: 100%;
                height: 100%;
                content: "";
                top: 0;
                left: 0;
            }
        }

        .icon-sort-arrow {
            opacity: 0;
        }

        th a:hover,
        th[data-active=true] {
            color: dodgerblue;
            .icon-sort-arrow {
                opacity: 1;
            }
        }
        th a {
            position: relative;
            z-index: 1;
            text-decoration: none;
            color: inherit;
            font-weight: 600;
            display: flex;
            flex-direction: column;
            /* outline: 1px solid brown; */
        }

        td {
            border: 1px solid #eee;
            border-bottom: 1px solid #ddd;
            padding: 0 5px;
        }
        td {
            height: 1.5em;
        }
        tr:nth-of-type(even) {
            background-color: #f8f8f8;
        }

        td:first-of-type() {
            border-left: none;
            border-right: none;
        }
    }
`