import { Row } from "./types"
import { utils } from "./utils/utils"
import { MissingColumnError } from "./exceptions"
import { columns } from "./columns"


export async function processRows(rows: Row[]) {

    // 1. Remove unwanted columns
    utils.deleteColumns(rows, columns.ignored)

    // 2. Convert column labels to keys (only alphas and underscores)
    const columnLabelsToKeys = utils.buildColumnLabels(rows, columns.ignored)
    const columnKeysToLabels = utils.invertObject(columnLabelsToKeys)
    rows = utils.simplifyColumns(rows, columnLabelsToKeys)

    // 3. Make sure the required columns exist, otherwise the frontend breaks
    const cols = Object.keys(rows[0])
    for (const requiredColumn of columns.required) {
        if (!cols.includes(requiredColumn)) {
            throw new MissingColumnError(`Required column is missing: ${requiredColumn} - ${JSON.stringify(cols)}`)
        }
    }


    // 4. add ids
    rows.forEach(row => utils.addRowIds(row))


    // 5. Convert - and ? to null
    utils.convertToNulls(rows)

    // 6. Some columns contain strings that are
    // not quite numbers, for example "1,200.90"
    // Convert them to numbers.
    utils.coerceNumericalColumns(rows, columns.numerical)

    // 7. Find out if a column contains only strings or also numbers
    // Also calculate min/max (if numerical) and available options (if textual)
    const columnMetadata = utils.buildColumnMetadata(rows, columnKeysToLabels)

    // 8. If a textual column contains any null value,
    // convert all null values to "-", and add "-" to the column options.
    for (const col of columnMetadata) {
        if (!col.numerical) {
            let nullsFound = false
            for (const row of rows) {
                if (row[col.key] === null) {
                    row[col.key] = "-"
                    nullsFound = true
                }
            }
            if (nullsFound) {
                col.options.push("-")
            }
        }
    }

    return { rows, columnMetadata }
}

