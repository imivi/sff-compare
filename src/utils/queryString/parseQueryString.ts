import { Options, deserializeFilters } from "./deserializeFilters"
import { Filters } from "./serializeFilters"

export type Query = {
    fil: Filters,
    col: number
    asc: boolean // ascending order if true (default)
}

export function parseQueryString(query: Record<string,unknown>, options: Options): Query {

    const filterQuery = query?.fil || query?.fil

    return {
        col: query?.col ? Number(query.col) : 0,
        asc: query?.asc==="false" ? false : true,
        fil: typeof filterQuery === "string" ? deserializeFilters(filterQuery,options) : {},
    }
}