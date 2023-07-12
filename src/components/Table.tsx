import { CoolerLP } from "@/types"
import { css } from "@emotion/react"
import { useRouter } from "next/router"
import Link from "next/link"
import { ArrowUp, ArrowDown } from "tabler-icons-react"
import { compareValues } from "@/utils/compareValues"
import { MouseEvent } from "react"
import { Query, parseQueryString } from "@/utils/queryString/parseQueryString"
import { getOptions } from "@/utils/getOptions"
import FilterControls from "./FilterControls"
import { DeserializedFilters } from "@/utils/queryString/deserializeFilters"
import { stringifyFilters } from "@/utils/queryString/stringifyFilters"



function filterRow(row: Partial<CoolerLP>, filters: DeserializedFilters, header: string[]) {
    /*
    fil = {
        0: [1,2],
        3: [10,11],
    }
    */

    for(const headerIndex of Object.keys(filters)) {
        const headerKey = header[Number(headerIndex)]
        
    }
    
    const key = header[0]
    // fil.
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


    const sortKey = Object.values(header)[query.col] as keyof CoolerLP

    const sortedRows = rows
        .filter(row => filterRow(row, query.fil, header))
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

            <FilterControls query={ query } options={ options }/>
            
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
    grid-template-columns: 20rem 1fr;
    position: absolute;
    width: 100vw;
    height: 100vh;

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