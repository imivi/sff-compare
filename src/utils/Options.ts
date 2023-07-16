import { Row } from "@/data";
import { getOptions } from "./getOptions";


export class Options {

    values: Record<string, (string|number)[]>

    numberColumns = new Set<string>()

    constructor(rows: Row[]) {
        this.values = getOptions(rows)

        for(const [label,options] of Object.entries(this.values)) {
            const optionIsNumerical = isNumberColumn(options)
            if(optionIsNumerical) {
                this.numberColumns.add(label)
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

    indexOf(key: string, value: string|number) {
        return this.values[key].indexOf(value)
    }
}


function isNumberColumn(values: (string|number)[]) {
    return values.some(value => typeof value === "number")
}
