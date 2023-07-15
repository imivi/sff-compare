import { getOptions } from "./getOptions"
import { Options } from "./queryString/deserializeFilters"


function sortAlphanumeric(a: string|number, b: string|number): number {
    return (a.toString()).localeCompare(b.toString())
}


describe("get options", () => {

    test("get-options", () => {

        const input: Array<Record<string,string|number>> = [
            {
              "Brand": "Thermaltake",
              "Cooler": "Engine 17",
            //   "Type": "Top Down",
            //   "Length (mm)": 91.5,
            //   "Width (mm)": 91.5,
            //   "Height (mm)": 17,
            //   "Weight (g)": 205,
            //   "Heatsink Material": "Al",
            //   "Heatpipes": "-",
            //   "TDP (W)": 35,
            //   "RAM Clearance (mm)": "No limit",
            //   "Fans": 1,
            //   "Fan Size (mm)": "60x60x12.6",
            //   "Max Fan Speed (RPM)": 2500,
            //   "Max Air Flow (CFM)": 8.9,
            //   "Max Static Pressure (mmH2O)": 2.4,
            //   "Max Noise (dB(A))": 23,
            //   "AMD FM1 / FM2(+) / AM2(+) / AM3(+)": "-",
            //   "AMD AM4 / AM5": "-",
            //   "Intel 775": "-",
            //   "Intel 115X / 1200": "Y",
            //   "Intel 1366": "-",
            //   "Intel 1700": "?",
            //   "Intel 2011 / 2066": "-",
            //   "Remarks": ""
            },
            {
              "Brand": "Metalfish",
              "Cooler": "Z22",
            //   "Type": "Blower",
            //   "Length (mm)": 95,
            //   "Width (mm)": 84,
            //   "Height (mm)": 22,
            //   "Weight (g)": 380,
            //   "Heatsink Material": "Al",
            //   "Heatpipes": "-",
            //   "TDP (W)": 84,
            //   "RAM Clearance (mm)": "No limit",
            //   "Fans": 1,
            //   "Fan Size (mm)": "50x50x?",
            //   "Max Fan Speed (RPM)": 3000,
            //   "Max Air Flow (CFM)": 41,
            //   "Max Static Pressure (mmH2O)": "?",
            //   "Max Noise (dB(A))": 40,
            //   "AMD FM1 / FM2(+) / AM2(+) / AM3(+)": "-",
            //   "AMD AM4 / AM5": "-",
            //   "Intel 775": "Y",
            //   "Intel 115X / 1200": "Y",
            //   "Intel 1366": "-",
            //   "Intel 1700": "?",
            //   "Intel 2011 / 2066": "-",
            //   "Remarks": ""
            },
            {
              "Brand": "ID-Cooling",
              "Cooler": "IS-20i",
            //   "Type": "Top Down",
            //   "Length (mm)": 91,
            //   "Width (mm)": 91,
            //   "Height (mm)": 23,
            //   "Weight (g)": 140,
            //   "Heatsink Material": "Al",
            //   "Heatpipes": "-",
            //   "TDP (W)": 45,
            //   "RAM Clearance (mm)": "No limit",
            //   "Fans": 1,
            //   "Fan Size (mm)": "80x80x10",
            //   "Max Fan Speed (RPM)": 2700,
            //   "Max Air Flow (CFM)": 21.8,
            //   "Max Static Pressure (mmH2O)": 1.52,
            //   "Max Noise (dB(A))": 23,
            //   "AMD FM1 / FM2(+) / AM2(+) / AM3(+)": "-",
            //   "AMD AM4 / AM5": "-",
            //   "Intel 775": "-",
            //   "Intel 115X / 1200": "Y",
            //   "Intel 1366": "-",
            //   "Intel 1700": "?",
            //   "Intel 2011 / 2066": "-",
            //   "Remarks": ""
            },
        ]
    
        const output: Options = {
            "Brand": ["ID-Cooling","Metalfish","Thermaltake"],
            "Cooler": ["Engine 17", "IS-20i", "Z22"],
        }
    
        expect(getOptions(input)).toMatchObject(output)
    })
})
