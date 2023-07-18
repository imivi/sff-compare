import md5 from "md5"
import { googleSheetsId, googleSheetsTabs } from "../utils/googleSheetsUrls"
import { Row } from "./index"
import fs from "fs"
import PublicGoogleSheetsParser from "public-google-sheets-parser"
import { pages } from "./pages"



const parser = new PublicGoogleSheetsParser()

async function readSheet(sheetName: string): Promise<Record<string,string|number>[]> {
    const rows = await parser.parse(googleSheetsId, sheetName)
    return rows
}


async function get(page: string) {

    const outputPath = "src/data/cache/"+page+".json"
    const sheetName = googleSheetsTabs[page]
    
    if(fs.existsSync(outputPath)) {
        console.log(`[✓] Exists: ${ page } (${ sheetName })`)
        const rows = fs.readFileSync(outputPath, { encoding: "utf-8" })
        return JSON.parse(rows)
    }
    
    const rows = await readSheet(sheetName)
    fs.writeFileSync(outputPath, JSON.stringify(rows,null,4), { encoding: "utf8" })
    console.log(`[✓] Fetched: ${ page } (${ sheetName })`)
    return rows
}


// Fetch all pages
async function fetchAll() {
    const rowsByPage = await Promise.all(pages.map(async (page) => {
        const rows = await get(page)
        // Add columns: "page" and "id"
        for(const row of rows) {
            row.id = md5(JSON.stringify(row)).slice(0,8) // Keep only 1/4 of the MD5 hash (32 -> 8 chars)
            row.page = page
        }
        return rows as Row[]
    }))

    // Flatten array
    const allRows = rowsByPage.flat(1)
    
    fs.writeFileSync("src/data/data.json", JSON.stringify(allRows,null,4), { encoding: "utf-8" })
}
fetchAll()
