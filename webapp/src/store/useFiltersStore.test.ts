import { test, expect } from "vitest"
import { createFiltersFromQueryString } from "./useFiltersStore"
import { ColumnMetadata } from "@/types"

const query = {
    "results": "25",
    "sort": "case,1",
    "case_length_mm": "155,396",
    "volume_l": "1.89,28",
    "page": "1"
}

const columns: ColumnMetadata[] = [
    {
        index: 1,
        key: "case_length_mm",
        integer: false,
        numerical: true,
        label: "",
        min: 0,
        max: 100,
    },
    {
        index: 2,
        key: "volume_l",
        integer: false,
        numerical: true,
        label: "",
        min: 0,
        max: 100,
    },
]

test('Create filters from query string', () => {
    const filters = createFiltersFromQueryString(query, columns)
    expect(filters).toMatchObject({
        case_length_mm: {
            numerical: true,
            min: 155,
            max: 396,
        },
        volume_l: {
            numerical: true,
            min: 1.89,
            max: 28,
        },
    })
})