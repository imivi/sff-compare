import { Options } from "./deserializeFilters"



export type Range = {
    min: number,
    max: number,
    includeUnknown: boolean
}


/**
example.com/ ?r=0:0,1,true;1:4,5

->

{
    "0": {
        "min": 0,
        "max": 1,
        "unknown": true
    }
}
 * @param queryString 
 */
export function parseRangeQuery(queryString: string, options: Options): Record<string, Range> {
    const numericalRange = parseRangeQueryToNumerical(queryString)
    const ranges = parseNumericalRange(numericalRange, options)
    // console.info({ queryString, options }, "-->", ranges)
    return ranges
}

export function parseRangeQueryToNumerical(queryString: string): Record<number, Range> {
    // const rangesAsArrays = JSON.parse(queryString)

    if (queryString.length === 0) {
        return {}
    }

    const output: Record<number, Range> = {}

    queryString.split(";").forEach(str => {
        const [indexStr, valuesStr] = str.split(":")
        const [min, max, includeUnknown] = valuesStr.split(",")
        output[Number(indexStr)] = {
            min: Number(min),
            max: Number(max),
            includeUnknown: includeUnknown === "true" ? true : false,
        }
    })

    // for (const [indexStr, values] of Object.entries(rangesAsArrays)) {
    //     const [min, max, includeUnknown = true] = values as [number,number,boolean?]
    //     output[Number(indexStr)] = { min, max, includeUnknown }
    // }

    return output
}

export function parseNumericalRange(numericalRanges: Record<number, Range>, options: Options): Record<string, Range> {

    const result: Record<string, Range> = {}

    for (const [index, values] of Object.entries(numericalRanges)) {
        const optionLabel = Object.keys(options).sort()[Number(index)]
        result[optionLabel] = values
    }

    return result
}




export function stringifyRange(ranges: Record<string, Range>, options: Options): string {

    const indexedRanges = indexRanges(ranges, options)
    return stringifyIndexedRanges(indexedRanges)
}



export function indexRanges(ranges: Record<string, Range>, options: Options): Record<number, [number, number, boolean]> {

    const indexedRanges: Record<number, [number, number, boolean]> = {}

    for (const [indexStr, range] of Object.entries(ranges)) {

        
        const indexedKey = Object.keys(options).sort().indexOf(indexStr)
        // console.info({ indexedKey, range, options })

        // const currentOptions = options[indexStr].indexOf
        // const indexedMin = options[indexStr].indexOf(range.min)
        // const indexedMax = options[indexStr].indexOf(range.max)


        // if (!options[indexStr] || !indexedMin || !indexedMax) {
        //     console.error({ indexStr, indexedKey, indexedMin, indexedMax })
        // }

        // if(indexedKey >= 0 && indexedMin >= 0 && indexedMax >= 0) {
            indexedRanges[indexedKey] = [range.min, range.max, range.includeUnknown]
        // }

    }
    return indexedRanges
}


export function stringifyIndexedRanges(indexedRanges: Record<number, [number, number, boolean]>): string {

    const rangeStrings: string[] = []
    for (const [key, values] of Object.entries(indexedRanges)) {
        const [min, max, includeUnknown] = values

        const stringifiedValues = includeUnknown ? [min, max, includeUnknown] : [min, max] // Omit includUnknown boolean if false
        rangeStrings.push(`${key}:${stringifiedValues.join(",")}`)
    }
    return rangeStrings.join(";")
}
