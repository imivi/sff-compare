import { NumericalFilters } from "./stringifyFilters"



export type Options = Record<string, (string|number)[]>
export type DeserializedFilters = Options

export function deserializeFilters(queryString: string, options: Options): DeserializedFilters {
    const numericalFilters = parseFiltersString(queryString)


    // const output: Record<string,string[]> = {}
    const output: DeserializedFilters = {}
    Object.entries(numericalFilters).forEach(([headerIndex,optionsValues]) => {
        const headerKey = Object.keys(options)[Number(headerIndex)]
        const currentOptions = options[headerKey]
        if(currentOptions) {
            output[headerKey] = optionsValues.map(i => currentOptions[i])
        }
    })
    
    return output
}


/**
 * Extract filters from query string as numbers
 * @example 0:1,2; 10:3,4 -> header 0 has options 1 & 2; header 10 has options 3 & 4
 * @param queryString 
 */
export function parseFiltersString(queryString: string): NumericalFilters {

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
