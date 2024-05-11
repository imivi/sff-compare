import { Filters } from "./store/useFiltersStore"
import { CaseName, ColumnMetadata, Row } from "./types"

const apiUrl = '/api/'

async function getAllItems(): Promise<Row[]> {
    const response = await fetch(apiUrl + "cases")
    const { data } = await response.json()
    return data
}

function serializeQuery(query: Record<string, string | number | undefined>): string {
    let queryStringParts: string[] = []
    for (const key of Object.keys(query)) {
        if (query[key])
            queryStringParts.push(`${key}=${query[key]}`)
    }
    return queryStringParts.join("&")
}

export type Sort = {
    key: string
    ascending: boolean
}

async function getItem(itemId: string): Promise<Row> {
    const url = apiUrl + "cases/" + itemId
    const response = await fetch(url)
    const result = await response.json()
    const sffCase = result.data
    return sffCase
}

async function getItems(filters: Filters, currentPage: number, resultsPerPage: number, sort?: Sort): Promise<Row[]> {

    const queryParams: Record<string, string | number> = {}

    Object.entries(filters).forEach(([columnKey, filter]) => {
        if (filter.numerical) {
            // TODO - Ignore filter if selected range is same as column range
            queryParams[columnKey] = ['$bt', filter.min, filter.max].join(",")
        }
        else if (filter.options.length === 1) {
            queryParams[columnKey] = filter.options[0]
        }
        else if (filter.options.length > 1) {
            // TODO - Ignore filter if selected options length is same as column options length
            queryParams[columnKey] = ['$in', ...filter.options].join(",")
        }
    })

    const url = apiUrl + "cases?" + serializeQuery({
        ...queryParams,
        page: currentPage,
        results: resultsPerPage,
        sort: sort ? `${sort.key},${sort.ascending ? 1 : -1}` : undefined,
    })

    const response = await fetch(url)
    const { data } = await response.json()
    return data
}

async function getLastUpdateDate(): Promise<Date> {
    const response = await fetch(apiUrl + 'last-update')
    const { date } = await response.json()
    return date
}

async function getColumnsMetadata(): Promise<ColumnMetadata[]> {
    const response = await fetch(apiUrl + "columns")
    const { data } = await response.json()
    return data
}

async function getCaseNames(): Promise<CaseName[]> {
    const response = await fetch(apiUrl + "case-names")
    const { data } = await response.json()
    return data
}

export const api = {
    getAllItems,
    getItems,
    getItem,
    getColumnsMetadata,
    getCaseNames,
    getLastUpdateDate,
}