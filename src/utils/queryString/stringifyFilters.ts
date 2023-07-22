import { DeserializedFilters, Options } from "./deserializeFilters"

export type NumericalFilters = Record<number, number[]>

/**
 * 
 */
export function stringifyFilters(filters: DeserializedFilters, options: Options): string {
    const numericalFilters = serializeFilters(filters, options)
    if(Object.values(numericalFilters).some(nums => nums.some(n => n < 0))) {
        console.info("ERROR stringifying filters", {
            filters,
            options,
            numericalFilters,
        })
    }
    const stringifiedFilters = stringifyNumericalFilters(numericalFilters)
    console.info({ filters, options, numericalFilters, stringifiedFilters })
    return stringifiedFilters
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

            const indices: number[] = []
            
            selectedLabels.forEach(label => {
                let index = allOptions.indexOf(label)
                if(index >= 0) {
                    indices.push(index)
                    return
                }
                index = allOptions.indexOf(Number(label))
                if(index >= 0) {
                    indices.push(index)
                    return
                }
                console.info("ERROR: invalid option label:", label, { filters, options })
            })
            // console.log({ selectedLabels, index, indices, allOptions }
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