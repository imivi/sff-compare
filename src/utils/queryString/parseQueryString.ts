import { DeserializedFilters, Options, deserializeFilters } from "./deserializeFilters"
import { Range, parseRangeQuery } from "./range"
import {  } from "./stringifyFilters"

export type Query = {
    col: number
    asc: boolean // ascending order if true (default)
    fil: DeserializedFilters
    r: Record<string,Range>,
}

export function parseQueryString(query: Record<string,unknown>, options: Options): Query {

    const filterQuery = query?.fil || query?.f
    const rangeQuery = (query?.r as string) || ""

    return {
        col: query?.col ? Number(query.col) : 0,
        asc: query?.asc==="false" ? false : true,
        fil: typeof filterQuery === "string" ? deserializeFilters(filterQuery,options) : {},
        // r: query?.r,
        r: parseRangeQuery(rangeQuery,options)
    }
}