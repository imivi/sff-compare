import { deserializeFilters } from "./deserializeFilters";

describe("Deseralize query string", () => {

    test("test deserialize", () => {
        const input = "0:2,3"
        const output = {
            0: [2,3],
        }
        expect(deserializeFilters(input)).toMatchObject(output)
    })
    
    test("test deserialize when no options", () => {
        const input = "10:"
        const output = {}
        expect(deserializeFilters(input)).toMatchObject(output)
    })

    test("test deserialize nothing", () => {
        const input = ""
        const output = {}
        expect(deserializeFilters(input)).toMatchObject(output)
    })
})