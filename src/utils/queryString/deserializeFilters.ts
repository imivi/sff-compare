import { Filters } from "./serializeFilters"



export type Options = Record<string, (string|number)[]>

export function deserializeFilters(queryString: string, options: Options) {
    const numericalFilters = parseFiltersString(queryString)
    return numericalFilters
}


/**
 * Extract filters from query string as numbers
 * @example 0:1,2; 10:3,4 -> header 0 has options 1 & 2; header 10 has options 3 & 4
 * @param queryString 
 */
export function parseFiltersString(queryString: string): Filters {

    if(!queryString.includes(":")) {
        return {}
    }

    const filters = queryString.split(";").map(str => deserializeFilter(str))

    // Convert the array to an object
    const result: Record<number,number[]> = {}
    filters.forEach(({ headerIndex, optionsIndices }) => {
        result[headerIndex] = optionsIndices
    })

    return result
}

/**
 * @example 0:1,2 -> header 0 has options 1 & 2
 * @param queryString 
 */
export function deserializeFilter(queryString: string): { headerIndex: number, optionsIndices: number[] } {
    
    const [headerKeyStr, optionKeysStr] = queryString.split(":")

    // const headerKey = headers[Number(headerKeyStr)]
    const optionsKeys = optionKeysStr.split(",").map(str => Number(str))

    return {
        headerIndex: Number(headerKeyStr),
        optionsIndices: optionsKeys,
    }
}
