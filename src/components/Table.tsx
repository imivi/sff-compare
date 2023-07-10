import { CoolerLP } from "@/types"
import { css } from "@emotion/react"
import { useRouter } from "next/router"
import Link from "next/link"
import { ArrowUp, ArrowDown } from "tabler-icons-react"
import { compareValues } from "@/utils/compareValues"
import Filters from "./Filters"
import { MouseEvent } from "react"


type Props = {
    rows: Partial<CoolerLP>[],
}


type Query = {
    fil: string,
    col: number
    asc: boolean // ascending order if true (default)
}

export default function Table({ rows }: Props) {

    const header = Object.keys(rows[0])

    // Get filters and sorting from query string
    const router = useRouter()

    const query: Query = {
        col: router.query?.col ? Number(router.query.col) : 0,
        asc: router.query?.asc==="false" ? false : true,
        fil: typeof router.query?.fil === "string" ? router.query.fil : "",
        // order: router.query?.sort === "decr" ? "decr" : "incr",
    }

    // const {
    //     sort="incr",
    //     col="0"
    // } = router.query

    const sortKey = Object.values(header)[query.col] as keyof CoolerLP

    const sortedRows = rows.sort((a,b) => {

        return compareValues(a[sortKey], b[sortKey], query.asc)
        
    })

    // console.log({ asc: sort.asc, col: sort.col, sortKey })
    // console.log(sortedRows)

    // The URL is replaced with JS instead of using the actual anchor.
    // This way we prevent losing the scroll position.
    function handleHeaderClick(e: MouseEvent<HTMLAnchorElement>, newQuery: Query) {
        e.preventDefault()
        // console.log({ newQuery })
        router.replace({
            query: newQuery,
        })
    }

    return (
        <div className="table-container" css={ style }>

            <Filters rows={ rows }/>
            
            <table>
                <thead>
                    <tr>
                        {
                            header.map((label,i) => {

                                const newQuery: Query = { ...query, col: i, asc: query.col===i ? !query.asc : query.asc }

                                return <th key={ i } data-active={ query.col===i }>
                                    <Link href={{
                                        query: newQuery,
                                    }} replace={ true } onClick={(e) => handleHeaderClick(e, newQuery)}>
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
    )
}

const style = css`

    max-width: 100%;
    overflow-x: auto;

    table {
        border-collapse: collapse;

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
    }

    a {
        text-decoration: none;
        color: inherit;
        font-weight: 600;
    }
`