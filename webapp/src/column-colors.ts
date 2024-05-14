
export const higherIsBetter: Record<string, boolean> = {
    // "seller": false,
    // "case": false,
    // "style": false,
    "case_length_mm": false,
    "case_width_mm": false,
    "case_height_mm": false,
    "volume_l": false,
    "footprint_cm2": false,
    "weight_kg": false,
    // "side_panel": false,
    // "case_material": false,
    "cpu_cooler_height_mm": false,
    // "aio_radiator_support": false,
    // "gpu_riser": false,
    "gpu_length_mm": true,
    "gpu_width_mm": true,
    "gpu_height_thickness_mm": true,
    "pcie_slot": true,
    "lp_pcie_slot": true,
    // "motherboard": false,
    // "psu": false,
    // "25_drive": false,
    // "35_drive": false,
    // "525_drive": false,
    // "40_mm_fan": false,
    // "60_mm_fan": false,
    // "80_mm_fan": false,
    // "92_mm_fan": false,
    // "120_mm_fan": false,
    // "140_mm_fan": false,
    // "180_mm_fan": false,
    // "200_mm_fan": false,
    // "usba_20_io": false,
    // "usba_32_gen_1_5gbps_io": false,
    // "usbc_io": false,
    // "35mm_jack_io": false,
    "price_cny": false,
    "price_usd": false,
    // "status": false,
}

/**
 * Calculate the color shade from red to green
 * based on a range from 0 (red) to 1 (green).
 * Returns the HSL hue as a number from 0-360.
 */

export function calculateHue(percentage: number, higherIsBetter: boolean): number {

    if (!higherIsBetter)
        percentage = 1 - percentage

    // red = 0
    // green = 120
    return percentage * 120
}
