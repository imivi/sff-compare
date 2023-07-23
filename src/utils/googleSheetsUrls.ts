export const googleSheetsId = "1AddRvGWJ_f4B6UC7_IftDiVudVc8CJ8sxLUqlxVsCz4"
export const googleSheetsLink = "https://docs.google.com/spreadsheets/d/"+googleSheetsId

const googleSheetsTabsKeyed = {
    "cases1":       "SFF Case <10L",
    "cases2":       "SFF Case 10L-20L",
    "cases3":       "MFF Case >20L",
    "coolers1":     "CPU Cooler <70mm",
    "coolers2":     "CPU Cooler >70mm",
    "aio":          "AIO",
    "slim_fan":     "Slim Fan",
    "fans":         "Fans",
    "ram":          "RAM Height",
    "risers":       "PCIe Riser",
    "gpu1":         "SFF GPU <215mm",
    "gpu2":         "GPU >215mm",
    "gpu_spec":     "GPU Spec",
    "mobo1":        "mITX Boards",
    "mobo2":        "mDTX & mATX Boards",
    "psu":          "PSU",
    "cpu":          "CPU",
    "chipset":      "Chipset",
    // "oem":          "Console & Pre-Built",
}
export const googleSheetsTabs = googleSheetsTabsKeyed as Record<string, string>

// Keys
export type Pages = keyof typeof googleSheetsTabsKeyed
// Values
export type SheetName = typeof googleSheetsTabsKeyed[Pages]


/**
 * Options that should be hidden in the sidebar
 */
export const blacklist = new Set([
    "Remarks",
    "id",
    "page",
    "Review by Aris",
    "SFF.Net Link",
    "SFFPC Wiki Link",
    "Last Update",
])

export const hiddenFilters = new Set([

    // General
    "Name",

    // Cases3

    // CPU
    "AMD FM1 / FM2(+) / AM2(+) / AM3(+)",
    "AMD AM4 / AM5",
    "Intel 115X / 1200",
    "Intel 1366",
    "Intel 1700",
    "Intel 2011 / 2066",
    "Intel 775",
    "Heatsink Material",

    // PSU
    "12VHPWR (12+4pin) cable",
    "12VHPWR (12+4pin) Connectors",
    "Cybenetics ETA 115V",
    "Cybenetics ETA 230V",
    "Cybenetics Lambda 115V",
    "Cybenetics Lambda 230V",
    "Cybenetics Test Report",
    "80 PLUS Test Report",
    "24-pin (20+4) ATX cable",
    "8-pin (4+4) EPS cable",
    "8-pin (4+4) EPS Connectors",
    "PCIe (6+2) cable",
    "PCIe (6+2) Connectors",

    // AIO
    "12V RGB LED Connection",
    "5V Addressable RGB LED Connection",
    "AMD FM1 / FM2 (+) / AM2(+) / AM3(+)",
])
