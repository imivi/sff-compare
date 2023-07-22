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