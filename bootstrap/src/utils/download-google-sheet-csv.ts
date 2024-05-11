export async function readGoogleSheetAsCsv({ sheetId, sheetName }: { sheetId: string, sheetName: string }) {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}`
    const response = await fetch(url)
    const csv = await response.text()
    return csv
}
