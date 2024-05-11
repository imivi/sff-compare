import { createHash } from "crypto"
import { ColumnMetadata, Row } from "../types"

/** Returns true if all items in an array are the same */
function same<T>(items: T[]) {
    if (items.length > 1) {
        const first = items[0]
        for (let i = 1; i < items.length; i++) {
            if (items[i] !== first) {
                return false
            }
        }
    }
    return true
}

function columns(obj: Record<string, unknown>): string {
    return Object.keys(obj).join(",")
}

function isLetter(char: string): boolean {
    // return (char >= 'A' && char <= 'Z') || (char >= 'a' && char <= 'z')
    return char.toLowerCase() != char.toUpperCase()
}

const numbers = "0123456789".split("")

/** Convert to lowercase + only letters and numbers + underscore */
function simplifyLabel(key: string): string {
    let newkey = ""
    for (let char of key) {
        char = char.toLowerCase()
        if (char === " " && !newkey.endsWith("_")) {
            newkey += "_"
        }
        else if (char === "_" || char in numbers || isLetter(char)) {
            newkey += char
        }
    }
    return newkey
}

/**
 * Scan all rows and build an object that maps every unique key of a row to its simplified form.
 * @param rows 
 * @returns 
 */
function buildColumnLabels(rows: Row[], keysToIgnore: string[]): Record<string, string> {
    const allColumnLabels = new Set<string>()
    rows.forEach(obj => {
        Object.keys(obj).forEach(key => {
            if (!(key in keysToIgnore)) {
                allColumnLabels.add(key)
            }
        })
    })

    const labelsToIds: Record<string, string> = {}
    allColumnLabels.forEach(label => {
        labelsToIds[label] = simplifyLabel(label)
    })

    return labelsToIds
}


function simplifyColumns(rows: Row[], labelsToIds: Record<string, string>): Row[] {
    const simplifiedRows = rows.map(row => {
        const simplified: Row = {}
        for (const [key, value] of Object.entries(row)) {
            if (key in labelsToIds) {
                const simplifiedKey = labelsToIds[key]
                simplified[simplifiedKey] = value
            }
            else {
                simplified[simplifyLabel(key)] = value
            }
        }
        return simplified
    })
    return simplifiedRows
}

function hash(text: string): string {
    return createHash("md5").update(text).digest("hex").slice(0, 6)
}

function addRowIds(row: Row): void {
    if (row.seller == null || row.case == null) {
        throw new Error("Seller or Case is null! " + JSON.stringify(row))
    }
    row.id = hash(row.seller.toString() + " " + row.case.toString())
}

// export function addRowIds(rows: Row[]): Row[] {
//     return rows.map(row => ({
//         ...row,
//     }))
// }

/** 5. Convert - and ? to null */
function convertToNulls(rows: Row[]): void {
    for (const row of rows) {
        for (const [key, value] of Object.entries(row)) {
            if (value === "-" || value === "?" || value === "" || value === Number.NaN) {
                row[key] = null
            }
        }
    }
}

function invertObject(obj: Record<string, string>): Record<string, string> {
    const inverted: Record<string, string> = {}
    for (const [key, value] of Object.entries(obj)) {
        inverted[value] = key
    }
    return inverted
}

function buildColumnMetadata(rows: Row[], columnKeysToLabels: Record<string, string>): ColumnMetadata[] {

    /*
    for each column key,
    iterate over all rows
    if all values are numbers (or null), treat the column as numerical
    otherwise (if any value is a string), treat the column as textual
 
    if textual, gather all options and return them sorted
 
    if numerical, gather the min and max values
    also gather the step: if range < 10, range = 0.1; if range > 10, range = 1
    then adjust min and max based on the step (round down min and round up max)
    */

    const columnMetadata: ColumnMetadata[] = []

    Object.keys(columnKeysToLabels).forEach((key, i) => {
        const values = getAllRowValuesByKey(rows, key)

        // Skip this column if all values are null
        if (values.length === 0) {
            return
        }

        const rowIsTextual = values.some(value => typeof value === "string")

        if (rowIsTextual) {
            const uniqueValues = Array.from(new Set(values))
            columnMetadata.push({
                numerical: false,
                index: i,
                key,
                label: columnKeysToLabels[key],
                options: uniqueValues.map(value => value.toString()).sort(),
            })
        }

        else {
            const numericalValues = values.filter(value => typeof value === "number").filter(n => n) as number[]
            let min = Math.min(...numericalValues)
            let max = Math.max(...numericalValues)

            if (!min || !max) {
                throw new Error(JSON.stringify({ key, min, max, numericalValues }))
            }
            // const step = (max - min) > 10 ? 1 : 0.1
            // max = Math.ceil(max)
            // min = Math.floor(min)
            columnMetadata.push({
                numerical: true,
                key,
                index: i,
                label: columnKeysToLabels[key],
                min,
                max,
                integer: numericalValues.every(num => Number.isInteger(num))
                // step,
                // values: numericalValues,
            })
        }
    })

    return columnMetadata
}


function getAllRowValuesByKey(rows: Row[], key: string): (string | number)[] {
    const values: (string | number)[] = []
    rows.forEach(row => {
        const value = row[key]
        if (value !== null) {
            values.push(value)
        }
    })
    return values
}

function deleteColumns(rows: Row[], columnsToDelete: string[]): void {
    for (const row of rows) {
        for (const col of columnsToDelete) {
            delete row[col]
        }
    }
}

function isDigit(char: string): boolean {
    return char in '0123456789'.split('')
}

function removeLetters(text: string): string {
    const chars = []
    for (const char of text) {
        if (char === "." || isDigit(char)) {
            chars.push(char)
        }
    }

    return chars.join('')
}

function coerceNumerical(value: string | number): number {
    const num = Number(value) ?? Number(removeLetters(value.toString()))
    if (num === undefined) {
        throw new Error("Could not coerce to number: " + value.toString())
    }
    return num
}

function coerceNumericalColumns(rows: Row[], columns: string[]): void {
    for (const row of rows) {
        for (const col of columns) {
            const value = row[col]
            if (value != null) {
                row[col] = coerceNumerical(value)
            }
        }
    }
}

export const utils = {
    coerceNumericalColumns,
    removeLetters,
    isDigit,
    addRowIds,
    buildColumnLabels,
    convertToNulls,
    deleteColumns,
    buildColumnMetadata,
    invertObject,
    simplifyColumns,
    columns,
    same,
    simplifyLabel,
    hash,
}