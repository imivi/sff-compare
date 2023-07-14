import { SheetName, googleSheetsTabs } from "./googleSheetsUrls";
import { readSheet } from "./read-public-sheet";
import fs from "fs"

async function get() {
    const page = "ram"
    const sheetName = googleSheetsTabs[page]
    const rows = await readSheet(sheetName)
    console.log("Fetched rows:", rows.length)
    fs.writeFileSync("src/dumps/"+page+".json", JSON.stringify(rows,null,4), { encoding: "utf8" })
    console.log(`OK: ${ page }.json`)
}
get()