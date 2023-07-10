export function compareValues(a: string|number|undefined, b: string|number|undefined, ascending: boolean): number {

    if(!a || a==="-" || a==="?") {
        return 1
    }
    if(!b || b==="-" || b==="?") {
        return -1
    }

    const asc = ascending ? 1 : -1

    if(typeof a === "number" && typeof b === "number") {
        if(a===b) {
            return 0
        }
        return (a < b ? -1 : 1) * asc
    }

    
    if(typeof a === "string" && typeof b === "string") {
        return a.toString().localeCompare(b.toString()) * asc
    }
    
    // Don't sort
    return 0
}