import { DeserializedFilters, Options, deserializeFilters } from "./deserializeFilters"
import {  } from "./stringifyFilters"

export type Query = {
    col: number
    asc: boolean // ascending order if true (default)
    fil: DeserializedFilters
}

export function parseQueryString(query: Record<string,unknown>, options: Options): Query {

    const filterQuery = query?.fil || query?.f

    return {
        col: query?.col ? Number(query.col) : 0,
        asc: query?.asc==="false" ? false : true,
        fil: typeof filterQuery === "string" ? deserializeFilters(filterQuery,options) : {},
    }
}