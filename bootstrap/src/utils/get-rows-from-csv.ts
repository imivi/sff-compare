import fs from "fs"
import { Row } from "../types"
import { readGoogleSheetAsCsv } from "./download-google-sheet-csv"
import Papaparse from "papaparse"
import { utils } from "./utils"
import { ColumnMismatchError, MissingColumnError } from "../exceptions"
import { env } from "../env"
import { logger } from "../logger"


/*
to get all rows,
read every sheet and save to csv (return 3 csvs)
then read the 3 csvs and parse them
then merge them
*/

async function getRowsFromCsvSheet(sheetName: string): Promise<Row[]> {
    // const USE_JSON_INSTEAD_OF_FETCHING_CSV = false
    // if (USE_JSON_INSTEAD_OF_FETCHING_CSV) {
    //     const rows: Row[] = JSON.parse(fs.readFileSync('Notes/SFF PC Master List - SFF Case 10L.json', { encoding: 'utf-8' }))
    //     return rows
    // }

    // sheetNames

    let csv = ""
    const cachedCsvPath = `cache/${sheetName}.csv`
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

    // Parse CSV

    const parseResult = Papaparse.parse<Row>(csv, {
        header: true, // Each returned row is a object instead of an array
        dynamicTyping: true, // Attempt to parse strings into numbers
    })

    const { data } = parseResult

    // fs.writeFileSync('cache/parsed_csv_sff_case_10l.json', JSON.stringify(data, null, 4))

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


// const sheetNames = [
//     'SFF Case <10L',
//     'SFF Case 10L-20L',
//     'MFF Case >20L',
// ]

// getRowsFromCsvSheets(sheetNames)