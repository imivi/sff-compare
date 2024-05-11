/*
These columns are manually handled in some way.
*/

const ignoredColumns = [
    'SFF.Net Link',
    'SFFPC Wiki Link',
    'Last Update',
    '',
]

const coerceNumerical = [
    'case_length_mm',
    'case_width_mm',
    'cpu_cooler_height_mm',
    'gpu_length_mm',
    'gpu_width_mm',
    'gpu_height_thickness_mm',
    'price_cny',
]

const requiredColumns = [
    'seller',
    'case',
    'case_length_mm',
    'case_width_mm',
    'case_height_mm',
]

export const columns = {
    ignored: ignoredColumns,
    numerical: coerceNumerical,
    required: requiredColumns,
}