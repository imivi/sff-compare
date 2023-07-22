import { Row } from "@/data"
import { getOptions } from "./getOptions"
import { blacklist } from "./googleSheetsUrls"


export class Options {

    values: Record<string, (string|number)[]>

    numberColumns = new Set<string>()

    constructor(rows: Row[]) {
        // Ignore blacklisted options
        this.values = getOptions(rows, blacklist)

        // Check which options are numerical and which are text
        for(const [label,options] of Object.entries(this.values)) {
            if(!blacklist.has(label)) {
                // 
                const optionIsNumerical = isNumberColumn(options)
                if(optionIsNumerical) {
                    this.numberColumns.add(label)
                }
            }
        }
    }

    isNumerical(key: string) {
        return this.numberColumns.has(key)
    }

    getKeys() {
        return Object.keys(this.values)
    }

    getValues(key: string) {
        return this.values[key] || []
    }

    indexOf(key: string, value: string|number): number|null {
        const index = this.values[key].indexOf(value)
        return index < 0 ? null : index
    }
}


function isNumberColumn(values: (string|number)[]) {
    return values.some(value => typeof value === "number")
}
