import s from "./Table.module.scss"

import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query"
import { useFilterStore } from "../store/useFiltersStore"
import { useSelectionStore } from "../store/useSelectionStore"
import { api } from "../api"
import { ColumnMetadata, Row } from "@/types"
import { useRouter } from "next/router"
import { useQueryParams } from "@/hooks/useQueryParams"
import Link from "next/link"
import { IconArrowDown, IconArrowUp, IconChevronLeft, IconChevronRight, IconChevronsLeft, IconDownload } from "@tabler/icons-react"
import Viewer from "./viewer/Viewer"
import { useLayoutStore } from "@/store/useLayoutStore"
import { sortRows } from "@/utils"
import { useFuseSearch } from "@/hooks/useFuseSearch"
import LoadingSpinner from "./LoadingSpinner"
import { CSVLink } from "react-csv"
import { calculateHue, higherIsBetter } from "@/column-colors"
import { CSSProperties } from "react"


function extractValidQueryResults<T>(results: { data?: T }[]): T[] {
    const items: T[] = []
    results.map(result => {
        if (result.data) {
            items.push(result.data)
        }
    })
    return items
}



export default function Table() {

    const queryClient = useQueryClient()

    const getColumnsQuery = useQuery<ColumnMetadata[]>({
        queryKey: ["columns"],
        queryFn: api.getColumnsMetadata,
    })

    const selectedCaseIds = useSelectionStore(store => Array.from(store.selectedCaseIds))
    const showViewer = useLayoutStore(store => store.showViewer)
    const maximizeViewer = useLayoutStore(store => store.maximizeViewer)
    const toggleViewer = useLayoutStore(store => store.toggleViewer)

    const toggleSelectCase = useSelectionStore(store => store.toggleSelect)
    const onlyShowSelected = useSelectionStore(store => store.onlyShowSelected)
    const setOnlyShowSelected = useSelectionStore(store => store.setOnlyShowSelected)

    const filters = useFilterStore(store => store.appliedFilters)

    const router = useRouter()

    const { currentPage, resultsPerPage, sort, search } = useQueryParams()

    const searchedCaseIds = useFuseSearch(search, resultsPerPage)

    // (1) Fetch cases according to the active filters
    const getCasesQuery = useQuery({
        queryKey: ["cases", filters, currentPage, resultsPerPage, sort],
        queryFn: () => api.getItems(filters, currentPage, resultsPerPage, sort),
    })

    // (2) Fetch cases according to the selection checkboxes
    const getSelectedCasesQuery = useQueries({
        queries: selectedCaseIds.map(caseId => ({
            queryKey: ["case", caseId],
            queryFn: async () => api.getItem(caseId),
        })),
    })

    // (3) Fetch cases according to the text search results
    const getSearchedCasesQuery = useQueries({
        queries: searchedCaseIds.map(caseId => ({
            queryKey: ["case", caseId],
            queryFn: async () => api.getItem(caseId),
        })),
    })

    const columns = getColumnsQuery.data
    const rows = getCasesQuery.data

    function setResultsPerPage(results: number) {
        router.push({
            query: {
                ...router.query,
                page: 1,
                results,
            }
        })
    }

    function caseIsSelected(caseId: string | number | null) {
        if (typeof caseId === "string") {
            return selectedCaseIds.includes(caseId)
        }
        return false
    }

    function getNewSort(currentColumnKey: string, newColumnKey: string, currentSortOrderAscending: boolean): string {

        // If the user clicks on the column
        // that is already used for sorting,
        // invert the sort order
        if (currentColumnKey === newColumnKey) {
            const newSortOrder = currentSortOrderAscending ? -1 : 1
            return `${newColumnKey},${newSortOrder}`
        }

        // If the user clicks on a new column, keep the sort order the same
        else {
            const newSortOrder = 1
            return `${newColumnKey},${newSortOrder}`
        }
    }

    function handleClickCheckbox(caseId: string) {
        if (!showViewer && selectedCaseIds.length === 0) {
            toggleViewer()
        }
        toggleSelectCase(caseId)
    }

    function getRowsToShow(): Row[] | undefined {
        const userIsSearching = searchedCaseIds.length > 0
        if (userIsSearching) {
            return extractValidQueryResults(getSearchedCasesQuery)
        }
        if (onlyShowSelected) {
            return sortRows(extractValidQueryResults(getSelectedCasesQuery), sort.key, sort.ascending)
        }
        return rows
    }

    const rowsToShow = getRowsToShow()

    const showSelectedButton = searchedCaseIds.length === 0 && selectedCaseIds.length > 1
    const showPageButtons = searchedCaseIds.length === 0 && !onlyShowSelected
    const resultCountSelect = !onlyShowSelected

    const showSearchCount = searchedCaseIds.length > 0

    function getCsvRows(): unknown[][] {

        if (!getColumnsQuery.data || !rowsToShow) {
            return []
        }

        const headerRow = getColumnsQuery.data.map(value => value.label)
        const headerKeys = getColumnsQuery.data.map(value => value.key)
        const dataRows = rowsToShow.map(row => headerKeys.map(key => row[key] || ""))

        return [headerRow, ...dataRows]
    }

    return (

        <div className={s.container}>

            {getCasesQuery.isLoading && <div><LoadingSpinner size={36} /></div>}

            {getColumnsQuery.error && <p>An error occurred</p>}

            {getCasesQuery.data && getCasesQuery.data.length === 0 && <p>No cases found!</p>}

            {!getColumnsQuery.data && !getColumnsQuery.isLoading && <p>No columns data</p>}

            {getColumnsQuery.data && getColumnsQuery.data.length === 0 && <p>No results found!</p>}

            {
                getColumnsQuery.data && getCasesQuery.data && getCasesQuery.data.length > 0 &&
                <table data-show={!maximizeViewer || !showViewer}>

                    <thead>
                        <tr>
                            <th></th>
                            {columns?.map(col => (
                                <th key={col.key}>
                                    <Link
                                        // If no sort is specified in the query string,
                                        // sort this column in ascending order.
                                        // If any sort is specified, reverse the order.
                                        href={{
                                            query: {
                                                ...router.query,
                                                sort: sort ? getNewSort(sort.key, col.key, sort.ascending) : `${col.key},1`,
                                            }
                                        }}
                                        onClick={() => queryClient.invalidateQueries({ queryKey: ["cases"] })}
                                        data-active={sort.key === col.key && searchedCaseIds.length === 0}
                                    >
                                        <span>{col.label}</span>
                                        {
                                            searchedCaseIds.length === 0 &&
                                            <>
                                                {(sort && sort.key === col.key && sort.ascending) && <IconArrowUp className={s.icon_sort} />}
                                                {(sort && sort.key === col.key && !sort.ascending) && <IconArrowDown className={s.icon_sort} />}
                                            </>
                                        }
                                    </Link>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {
                            rowsToShow &&
                            rowsToShow.map((row, i) => (
                                <tr key={i}>
                                    <td>
                                        {
                                            (row.id && typeof row.id === "string") &&
                                            <input type="checkbox"
                                                checked={caseIsSelected(row.id)}
                                                onChange={() => handleClickCheckbox(row.id as string)}
                                            />
                                        }
                                        {/* <small>{row.id?.toString().slice(0, 6)}</small> */}
                                    </td>
                                    {
                                        columns && Object.values(columns).map((col, j) => (
                                            <Cell
                                                onClick={(j == 0 || j == 1) ? () => handleClickCheckbox(row.id as string) : undefined}
                                                key={j}
                                                value={row[col.key]}
                                                column={col}
                                            />
                                        ))
                                    }
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            }

            <footer className={s.pagination} data-show={!maximizeViewer || !showViewer}>

                {
                    showSearchCount &&
                    <div>
                        <span>Showing {rowsToShow?.length} results for search <strong>{search}</strong> </span>
                        <Link className={s.btn} href={{ query: { ...router.query, search: "" } }}>search by filters instead</Link>
                    </div>
                }

                {
                    !showSelectedButton ? <div></div> :
                        <label className={s.checkbox_show_selected} data-highlight={onlyShowSelected}>
                            <input
                                type="checkbox"
                                checked={onlyShowSelected}
                                onChange={() => setOnlyShowSelected(!onlyShowSelected)}
                            />
                            <span>Compare selected ({selectedCaseIds.length})</span>
                        </label>
                }

                {
                    showPageButtons &&
                    <div className={s.page_select}>
                        {
                            currentPage > 2 ?
                                <Link
                                    href={{ query: { ...router.query, page: 1 } }}
                                    onClick={() => queryClient.invalidateQueries({ queryKey: ["cases"] })}
                                >
                                    <IconChevronsLeft size={24} color="white" />
                                </Link>
                                : <div></div>
                        }
                        {
                            currentPage > 1 ?
                                <Link
                                    href={{ query: { ...router.query, page: currentPage - 1 } }}
                                    onClick={() => queryClient.invalidateQueries({ queryKey: ["cases"] })}
                                >
                                    <IconChevronLeft size={24} color="white" />
                                </Link>
                                : <div></div>
                        }
                        <span>{currentPage}</span>
                        {
                            <Link
                                href={{ query: { ...router.query, page: currentPage + 1 } }}
                                onClick={() => queryClient.invalidateQueries({ queryKey: ["cases"] })}
                            >
                                <IconChevronRight size={24} color="white" />
                            </Link>
                        }
                    </div>
                }


                {
                    resultCountSelect &&
                    <label>
                        <span>Results</span>
                        <select
                            name="resultsPerPage"
                            id="resultsPerPage"
                            value={resultsPerPage}
                            onChange={(e) => setResultsPerPage(Number(e.target.value))}
                        >
                            {
                                [25, 50, 100].map(n => (
                                    <option key={n} value={n}>{n}</option>
                                ))
                            }
                        </select>
                    </label>
                }
                <CSVLink
                    data={getCsvRows()}
                    target="_blank"
                    className={s.btn_download_csv}
                    filename="sff-cases.csv"
                >
                    <IconDownload size={18} /> CSV
                </CSVLink>

            </footer>

            <Viewer />

        </div>
    )
}


type CellProps = {
    column: ColumnMetadata
    value: number | string | null
    onClick?: () => void
}

function Cell({ column, value, onClick }: CellProps) {

    // return <td>{JSON.stringify([column.key, value, higherIsBetter.hasOwnProperty(column.key)])}</td>
    let cellStyle: CSSProperties = {}

    if (column.numerical && typeof value === "number" && higherIsBetter.hasOwnProperty(column.key)) {
        // return <td style={{ backgroundColor: `hsla(${150}, 50%, 50%, 1)`, color: "white" }}>{value}</td>
        const columnRange = column.max - column.min
        const valuePercent = (value - column.min) / columnRange
        const hue = calculateHue(valuePercent, higherIsBetter[column.key])
        cellStyle = {
            // backgroundColor: `hsla(${hue}, 70%, 50%, 0.3)`,
            backgroundColor: `hsl(${hue}, 20%, 40%)`,
            border: `1px solid hsl(${hue}, 30%, 35%)`,
            color: "white",
        }
    }

    return (
        <td onClick={onClick} style={cellStyle} data-clickable={!!onClick}>
            <span data-clickable={!!onClick}>{value ?? "-"}</span>
        </td>
    )
}