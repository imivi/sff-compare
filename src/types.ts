// import asd from "./s"
// const csv = import("./cpu_cooler_70mm.csv")
// import csv from "./cpu_cooler_70mm.csv"

export type Sheet = {
    "CPU Cooler <70mm": CoolerLP[],
    "example": Example[],
}

type Example = {
    text: string,
    value: number,
}

export type CoolerLP = {
    "Brand": string,
    "Cooler": string,
    "Type": string,
    "Length (mm)": number,
    "Width (mm)": number,
    "Height (mm)": number,
    "Weight (g)": number,
    "Heatsink Material": string,
    "Heatpipes": number | "-",
    "TDP (W)": string,
    "RAM Clearance (mm)": string,
    "Fans": number,
    "Fan Size (mm)": string,
    "Max Fan Speed (RPM)": number,
    "Max Air Flow (CFM)": number,
    "Max Static Pressure (mmH2O)": number,
    "Max Noise (dB(A))": number,
    "AMD FM1 / FM2(+) / AM2(+) / AM3(+)": BoolStr,
    "AMD AM4 / AM5": BoolStr,
    "Intel 775": BoolStr,
    "Intel 115X / 1200": BoolStr,
    "Intel 1366": BoolStr,
    "Intel 1700": BoolStr,
    "Intel 2011 / 2066": BoolStr,
    "Remarks": string,
}

type BoolStr = "Y" | "-" | "?"