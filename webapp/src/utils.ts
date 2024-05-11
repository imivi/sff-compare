import { Row } from "./types"


export function sortRows(rows: Row[], sortKey: string, ascending: boolean): Row[] {
    return rows.sort((a, b) => {
        if (a && b && sortKey in a && sortKey in b) {
            const leftValue = a[sortKey]
            const rightValue = b[sortKey]
            if (leftValue && rightValue) {
                if (ascending)
                    return leftValue < rightValue ? -1 : 1
                else
                    return leftValue < rightValue ? 1 : -1
            }
        }
        return 0
    })
}