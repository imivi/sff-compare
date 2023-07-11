
export type Filters = Record<number,number[]>

/**
 * 
 */
export function serializeFilters(filters: Filters) {

    return Object.entries(filters).map(([key,options]) => (
        options.length > 0 ? `${ key }:${ options.join(",") }` : ""
    )).filter(str => str!=="").join(";")

}
