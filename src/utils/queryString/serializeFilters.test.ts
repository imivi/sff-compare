import { serializeFilters, type Filters } from "./serializeFilters"

describe("seralize filters", () => {

    test("serialize", () => {
        const input: Filters = {
            0: [1,2],
            3: [4,5],
        }
        const output = "0:1,2;3:4,5"

        expect(serializeFilters(input)).toBe(output)
    })
    
})