// import aio from "./aio.json"
// import cases1 from "./cases1.json"
// import cases2 from "./cases2.json"
// import cases3 from "./cases3.json"
// import chipset from "./chipset.json"
// import coolers1 from "./coolers1.json"
// import coolers2 from "./coolers2.json"
// import cpu from "./cpu.json"
// import fans from "./fans.json"
// import gpu1 from "./gpu1.json"
// import gpu2 from "./gpu2.json"
// import gpu_spec from "./gpu_spec.json"
// import mobo1 from "./mobo1.json"
// import mobo2 from "./mobo2.json"
// import oem from "./oem.json"
// import psu from "./psu.json"
// import ram from "./ram.json"
// import risers from "./risers.json"
// import slim_fan from "./slim_fan.json"
import allRows from "./data.json"

// export const data = {
//     aio,
//     cases1,
//     cases2,
//     cases3,
//     chipset,
//     coolers1,
//     coolers2,
//     cpu,
//     fans,
//     gpu1,
//     gpu2,
//     gpu_spec,
//     mobo1,
//     mobo2,
//     oem,
//     psu,
//     ram,
//     risers,
//     slim_fan,
// }

// export const data = allSheets as Array<{ page: string, rows: Row[] }>

export type Row = {
    page: string
    id: string
    [key:string]: string|number
}

export const data = allRows as Row[]


// Pages to fetch (also used as dynamic URLs)
export const pages = [
    "cases1",
    "cases2",
    "cases3",
    "coolers1",
    "coolers2",
    "fans",
    "aio",
    "slim_fan",
    // "risers",
    "gpu1",
    "gpu2",
    "gpu_spec",
    "mobo1",
    "mobo2",
    "ram",
    "psu",
    "cpu",
    "chipset",
] as const

// Make a string union from the keys of "pages" array
type Page = typeof pages[number]

export const tabNames: Record<Page,string> = {
    "cases1":       "SFF Case <10L",
    "cases2":       "SFF Case 10-20L",
    "cases3":       "MFF Case >20L",
    "coolers1":     "CPU Cooler <70mm",
    "coolers2":     "CPU Cooler >70mm",
    "aio":          "AIO",
    "slim_fan":     "Slim Fan",
    "fans":         "Fans",
    "ram":          "RAM Height",
    // "risers":       "PCIe Riser",
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