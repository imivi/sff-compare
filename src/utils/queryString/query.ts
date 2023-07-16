// import { Options } from "./deserializeFilters";
import { Options } from "../Options";
import { parseQueryString } from "./parseQueryString";
import { Range, stringifyRange } from "./range";
import { stringifyFilters } from "./stringifyFilters";



type StrigifiedQuery = {
    asc: boolean
    col: number
    fil: string
    r:   string
}


export class Query {

    asc: boolean
    col: number
    fil: Record<string, (string|number)[]>
    r:   Record<string, Range>

    private options: Options

    constructor(query: Record<string,unknown>, options: Options) {
        const { asc, col, fil, r } = parseQueryString(query, options.values)
        this.asc = asc
        this.col = col
        this.fil = fil
        this.r   = r
        this.options = options
    }

    deleteFilter(filter: string): void {
        delete this.fil[filter]
    }

    stringify(): StrigifiedQuery {
        return {
            asc: this.asc,
            col: this.col,
            fil: stringifyFilters(this.fil, this.options.values),
            r: stringifyRange(this.r, this.options.values),
        }
    }
}