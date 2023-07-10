// const PublicGoogleSheetsParser = require('public-google-sheets-parser')
import { CoolerLP, type Sheet } from "@/types"
import PublicGoogleSheetsParser from "public-google-sheets-parser"
import coolers_lp from "./coolers_lp.json"

// https://docs.google.com/spreadsheets/d/10WDbAPAY7Xl5DT36VuMheTPTTpqx9x0C5sDCnh4BGps/edit#gid=1839148703
// const spreadsheetId = '10WDbAPAY7Xl5DT36VuMheTPTTpqx9x0C5sDCnh4BGps'
// const sheetName = "Sheet1"

const sheetUrl = "https://docs.google.com/spreadsheets/d/1AddRvGWJ_f4B6UC7_IftDiVudVc8CJ8sxLUqlxVsCz4/edit#gid=200663719"
const sheetId = "1AddRvGWJ_f4B6UC7_IftDiVudVc8CJ8sxLUqlxVsCz4"

// console.log({ sheetId })


export type Row = {

}


// DOCUMENTATION: https://github.com/fureweb-com/public-google-sheets-parser

// 1. You can pass spreadsheetId when instantiating the parser:
const parser = new PublicGoogleSheetsParser(sheetId)

export async function readSheet<RowType>(sheetName: keyof Sheet): Promise<RowType[]> {

  /*
    const header = Object.keys(coolers_lp[0]) as (keyof RowType)[]
    // const rows: typeof coolers_lp = []

    for(const row of coolers_lp) {
      for(const key of header) {
        if(!(key in row)) {
          row[key] = null
        }
      }
    }
    */

    return coolers_lp as RowType[]
  
    /*
    const rows = await parser.parse(sheetId, sheetName)
    // items should be [{"a":1,"b":2,"c":3},{"a":4,"b":5,"c":6},{"a":7,"b":8,"c":9}]
    return rows as RowType[]
    */
}

// parser.parse().then((items) => {
// })

/*
// 2. You can change spreadsheetId on runtime:
const anotherSpreadsheetId = '1oCgY0UHHRQ95snw7URFpOOL_DQcVG_wydlOoGiTof5E'
parser.id = anotherSpreadsheetId
parser.parse().then((items) => {
//   items should be
//   [
//     {"id":1,"title":"This is a title of 1","description":"This is a description of 1","createdAt":"2020-11-12","modifiedAt":"2020-11-18"},
//     {"id":2,"title":"This is a title of 2","description":"This is a description of 2","createdAt":"2020-11-12","modifiedAt":"2020-11-18"},
//     ...
//   ]
})

// 3. You can pass the spreadsheet ID when call parse method:
parser.parse(spreadsheetId).then((items) => {
  // items should be [{"a":1,"b":2,"c":3},{"a":4,"b":5,"c":6},{"a":7,"b":8,"c":9}]
})


// 4. You can also retrieve a specific sheet to get by either passing the sheet name as a string (since v1.1.0):
parser.parse(spreadsheetId, 'Sheet2').then((items) => {
  // items should be [{"a":10,"b":20,"c":30},{"a":40,"b":50,"c":60},{"a":70,"b":80,"c":90}]
})
// ...or as an object (since v1.3.0) that specifies the sheet's name or ID. If both are provided, sheet ID is used:
parser.parse(spreadsheetId, { sheetId: '784337977' }).then((items) => {
  // items should be [{"a":10,"b":20,"c":30},{"a":40,"b":50,"c":60},{"a":70,"b":80,"c":90}]
})

// Sheet name or sheet ID can also be passed during instantiation:
const parser = new PublicGoogleSheetsParser(spreadsheetId, { sheetId: '784337977'})
parser.parse().then((items) => {
  // items should be [{"a":10,"b":20,"c":30},{"a":40,"b":50,"c":60},{"a":70,"b":80,"c":90}]
})
*/