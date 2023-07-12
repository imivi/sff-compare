import { deserializeFilters, parseFiltersString } from "./deserializeFilters";

describe("Deseralize query string", () => {

    test("test deserialize", () => {
        const input = "0: 1,2;   1: 0,1".replaceAll(" ","")

        const options = {
            "apple":  ["a","b","c"],
            "banana": ["d","e","f"],
        }
        
        const output = {
            "apple":  ["b","c"],
            "banana": ["d","e"],
        }
        expect(deserializeFilters(input,options)).toMatchObject(output)
    })
})

describe("Parse filter query string", () => {

    test("test deserialize", () => {
        const input = "0:2,3"
        const output = {
            0: [2,3],
        }
        expect(parseFiltersString(input)).toMatchObject(output)
    })
    
    test("test deserialize when no options", () => {
        const input = "10:"
        const output = {}
        expect(parseFiltersString(input)).toMatchObject(output)
    })

    test("test deserialize nothing", () => {
        const input = ""
        const output = {}
        expect(parseFiltersString(input)).toMatchObject(output)
    })
})