import { Options } from "./deserializeFilters";
import { parseQueryString } from "./parseQueryString";
import { Range } from "./range";



type StrigifiedQuery = {
    asc: string
    col: string
    fil: string
    r:   string
}


export class Query {

    private asc: boolean
    private col: number
    private fil: Record<string, (string|number)[]>
    private r:   Record<string, Range>

    constructor(query: Record<string,unknown>, options: Options) {
        const { asc, col, fil, r } = parseQueryString(query, options)
        this.asc = asc
        this.col = col
        this.fil = fil
        this.r   = r
    }

    deleteFilter(filter: string): void {
        delete this.fil[filter]
    }

    stringify(): StrigifiedQuery {
        return "q="
    }
}