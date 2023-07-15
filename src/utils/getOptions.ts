import { Options } from "./queryString/deserializeFilters"


function sortAlphanumeric(a: string|number, b: string|number): number {
    return (a.toString()).localeCompare(b.toString())
}


export function getOptions(rows: Array<Record<string,string|number>>): Options {

    const possibleValues: Record<string,Set<string|number>> = {}

    rows.forEach(row => {
        for(const [key,value] of Object.entries(row)) {
            // Ignore "null" values
            // if(value === "-" || value === "" || value === "?") {
            //     return
            // }
            if(!(key in possibleValues)) {
                possibleValues[key] = new Set<string|number>()
            }
            // console.log("add",key,value)
            possibleValues[key].add(value)
        }
    })

    // const possibleValuesArrays: [string,(string|number)[]][] = []
    const possibleValuesArrays: Record<string, (string|number)[]> = {}

    for(const [key,set] of Object.entries(possibleValues)) {
        // possibleValuesArrays.push([key, Array.from(set)])
        possibleValuesArrays[key] = Array.from(set).sort(sortAlphanumeric)
    }

    return possibleValuesArrays
}

