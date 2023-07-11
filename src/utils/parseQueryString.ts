import { deserializeFilters } from "./filters/deserializeFilters"
import { Filters } from "./filters/serializeFilters"

export type Query = {
    fil: Filters,
    col: number
    asc: boolean // ascending order if true (default)
}

export function parseQueryString(query: Record<string,unknown>): Query {

    const filterQuery = query?.fil || query?.fil

    return {
        col: query?.col ? Number(query.col) : 0,
        asc: query?.asc==="false" ? false : true,
        fil: typeof filterQuery === "string" ? deserializeFilters(filterQuery) : {},
    }
}