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

type ComparisonGreater = {
    "$gt": number
}
type ComparisonLess = {
    "$lt": number
}
type ComparisonBetween = {
    "$gt": number
    "$lt": number
}
type Includes = {
    "$in": string[]
}

export type Comparison =
    | ComparisonGreater
    | ComparisonLess
    | ComparisonBetween
    | Includes


export type CaseName = {
    id: string
    seller: string
    case: string
}


export type SffCase = {
    id: string,
    label: string,
    size: [number, number, number],
    volume: number
    footprint: number
}
