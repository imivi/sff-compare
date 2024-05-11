import { utils } from "./utils"
import { expect, test } from "vitest"


test("should create a 6-character md5 hash", () => {
    expect(utils.hash("Silverstone SG13")).toMatch("c3be5a")
})

test("should create column labels to create column keys", () => {
    const simplified = Object.keys(columnsToSimplify).map(label => utils.simplifyLabel(label))
    expect(simplified).toMatchObject(Object.values(columnsToSimplify))
})

const columnsToSimplify = {
    "Seller": "seller",
    "Case": "case",
    "Style": "style",
    "Case Length (mm)": "case_length_mm",
    "Case Width (mm)": "case_width_mm",
    "Case Height (mm)": "case_height_mm",
    "Volume (L)": "volume_l",
    "Footprint (cm2)": "footprint_cm2",
    "Weight (kg)": "weight_kg",
    "Side Panel": "side_panel",
    "Case Material": "case_material",
    "CPU Cooler Height (mm)": "cpu_cooler_height_mm",
    "AIO / Radiator Support": "aio_radiator_support",
    "GPU Riser": "gpu_riser",
    "GPU Length (mm)": "gpu_length_mm",
    "GPU Width (mm)": "gpu_width_mm",
    "GPU Height / Thickness (mm)": "gpu_height_thickness_mm",
    "PCIe Slot": "pcie_slot",
    "LP PCIe Slot": "lp_pcie_slot",
    "Motherboard": "motherboard",
    "PSU": "psu",
    "2.5\" Drive": "25_drive",
    "3.5\" Drive": "35_drive",
    "5.25\" Drive": "525_drive",
    "40 mm Fan": "40_mm_fan",
    "60 mm Fan": "60_mm_fan",
    "80 mm Fan": "80_mm_fan",
    "92 mm Fan": "92_mm_fan",
    "120 mm Fan": "120_mm_fan",
    "140 mm Fan": "140_mm_fan",
    "180 mm Fan": "180_mm_fan",
    "200 mm Fan": "200_mm_fan",
    "USB-A 2.0 I/O": "usba_20_io",
    "USB-A 3.2 Gen 1 (5Gbps) I/O": "usba_32_gen_1_5gbps_io",
    "USB-C I/O": "usbc_io",
    "3.5mm Jack I/O": "35mm_jack_io",
    "Price (CNY)": "price_cny",
    "Price (USD)": "price_usd",
    "SFF.Net Link": "sffnet_link",
    "SFFPC Wiki Link": "sffpc_wiki_link",
    "Status": "status",
    "Last Update": "last_update",
}