import { Sort } from "@/api"
import { useRouter } from "next/router"

const DEFAULT_PAGE = 1
const DEFAULT_RESULTS_PER_PAGE = 25

type QueryParams = {
    currentPage: number
    resultsPerPage: number
    sort: Sort
    selected: string[]
    search: string
}

export function useQueryParams(): QueryParams {
    const router = useRouter()
    const query = router.query

    function getQueryValue(key: string): number | undefined {
        if (typeof query[key] === "string" && query[key] !== "") {
            const value = Number(query[key])
            if (value !== Number.NaN) {
                return value
            }
        }
        return undefined
    }

    function parseSort(): Sort {
        if (query.sort && typeof query.sort === "string") {
            if (query.sort.includes(",")) {
                const [key, asc] = query.sort.split(",")
                return { key, ascending: asc === "1" }
            }
            return {
                key: query.sort,
                ascending: true,
            }
        }
        // By default, sort by case name (ascending, i.e. alphabetical)
        return {
            key: "case",
            ascending: true,
        }
    }

    const queryParams = {
        currentPage: getQueryValue("page") ?? DEFAULT_PAGE,
        resultsPerPage: getQueryValue("results") ?? DEFAULT_RESULTS_PER_PAGE,
        sort: parseSort(),
        selected: (query.sel && typeof query.sel === "string") ? query.sel.split(",") : [],
        search: (query.search && typeof query.search === "string") ? query.search : "",
    }

    return queryParams
}