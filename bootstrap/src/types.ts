export type Row = Record<string, string | number | null>


export type ColumnMetadataNumerical = {
    numerical: true
    index: number
    key: string
    label: string
    min: number
    max: number
    integer: boolean // Whether the values only contain integers
}

export type ColumnMetadataTextual = {
    numerical: false
    index: number
    key: string
    label: string
    options: string[]
}

export type ColumnMetadata = ColumnMetadataNumerical | ColumnMetadataTextual
