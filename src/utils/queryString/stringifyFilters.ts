import { DeserializedFilters, Options } from "./deserializeFilters"

export type NumericalFilters = Record<number, number[]>

/**
 * 
 */
export function stringifyFilters(filters: DeserializedFilters, options: Options): string {
    const numericalFilters = serializeFilters(filters, options)
    return stringifyNumericalFilters(numericalFilters)
}

export function stringifyNumericalFilters(numericalFilters: NumericalFilters): string {
    return Object.entries(numericalFilters).map(([key, options]) => (
        options.length > 0 ? `${key}:${options.join(",")}` : ""
    )).filter(str => str !== "").join(";")
}



/**
 * Convert the selected options from strings to numerical indices
 * @param filters 
 * @param options 
 * @returns 
 */
export function serializeFilters(filters: DeserializedFilters, options: Options): NumericalFilters {

    if(Object.keys(filters).length === 0) {
        return {}
    }
    
    const output: NumericalFilters = {}

    for (const key of Object.keys(filters)) {
        const allOptions = options[key]
        // console.log({ key, allOptions })
        if (allOptions) {
            const selectedLabels = filters[key]
            const index = Object.keys(options).indexOf(key)
            const indices = selectedLabels.map(label => allOptions.indexOf(Number(label) || label))
            // console.log({ selectedLabels, index, indices, allOptions })
            output[index] = indices
        }
    }

    if(Object.keys(filters).length === 0) {
        throw Error("serializeFilters returning zero on a non-empty filter")
    }

    return output
}

/*
const filters: DeserializedFilters = {
    "cereal": ["rye","barley"],
}
const options: Options = {
    "fruit": ["apple", "banana", "coconut"],
    "cereal": ["barley", "wheat", "rye"],
}
const output: NumericalFilters = {
    1: [2, 0],
}
*/