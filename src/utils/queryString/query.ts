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
    c:   string
}


export class Query {

    asc: boolean
    col: number
    fil: Record<string, (string|number)[]>
    r:   Record<string, Range>
    c = new Set<string>() // compare row ids

    private options: Options

    // Only re-stringify the query properties that
    // have changed since they were first parsed.
    // private recompute = new Set<keyof Query>()

    constructor(query: Record<string,unknown>, options: Options) {
        const { asc, col, fil, r } = parseQueryString(query, options.values)
        this.asc = asc
        this.col = col
        this.fil = fil
        this.r   = r

        if(typeof query?.c === "string" && query.c !== "") {
            const ids_to_compare = typeof query?.c === "string" ? query.c.split(",") : []
            this.c = new Set<string>(ids_to_compare)
        }
        
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
            c: this.stringifyCompare(),
        }
    }

    clearCompare(): this {
        this.c.clear()
        return this
    }

    stringifyCompare(): string {
        return Array.from(this.c).join(",")
    }

    compareCount(): number {
        return this.c.size
    }

    hasRowId(rowId: string): boolean {
        return this.c.has(rowId)
    }

    toggleCompare(rowId: string): this {
        if(this.c.has(rowId)) {
            this.c.delete(rowId)
            return this
        }
        else {
            this.c.add(rowId)
            return this
        }
    }
}