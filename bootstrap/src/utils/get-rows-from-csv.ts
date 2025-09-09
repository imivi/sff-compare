import fs from "fs"
import { Row } from "../types"
import { readGoogleSheetAsCsv } from "./download-google-sheet-csv"
import Papaparse from "papaparse"
import { utils } from "./utils"
import { ColumnMismatchError } from "../exceptions"
import { env } from "../env"
import { logger } from "../logger"


async function getRowsFromCsvSheet(sheetName: string): Promise<Row[]> {

    const csvFilename = sheetName.replace(">", "gt").replace("<", "lt")

    let csv = ""
    const cachedCsvPath = `cache/${csvFilename}.csv`
    if (env.DEVELOPMENT && fs.existsSync(cachedCsvPath)) {
        csv = fs.readFileSync(cachedCsvPath, { encoding: "utf-8" })
        console.log("Using cached csv file:", sheetName)
    }
    else {
        logger.info("Downloading google sheet csv: " + sheetName)
        csv = await readGoogleSheetAsCsv({
            sheetId: env.GOOGLE_SHEET_ID,
            sheetName,
        })
        fs.writeFileSync(cachedCsvPath, csv, { encoding: 'utf-8' })
    }

    const parseResult = Papaparse.parse<Row>(csv, {
        header: true, // Each returned row is a object instead of an array
        dynamicTyping: true, // Attempt to parse strings into numbers
    })

    const { data } = parseResult

    return data
}

export async function getRowsFromCsvSheets(sheetNames: string[]): Promise<Row[]> {

    const rowsPerSheets = await Promise.all(sheetNames.map(name => getRowsFromCsvSheet(name)))

    // Make sure all sheets have the same columns
    if (!utils.same(rowsPerSheets.map(rows => utils.columns(rows[0])))) {
        throw new ColumnMismatchError("At least 2 sheets have different columns")
    }

    const allRows = rowsPerSheets.flat(1)
    fs.writeFileSync('cache/all_rows_from_all_sheets.json', JSON.stringify(allRows, null, 4))

    return allRows
}
