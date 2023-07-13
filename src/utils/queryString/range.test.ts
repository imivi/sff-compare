import { Range, indexRanges, parseRangeQueryToNumerical, stringifyIndexedRanges } from "./range"



describe("test range", () => {



    test("parseRangeQueryToNumerical", () => {
        const input = "0:0,1,true;1:4,5"

        const result: Record<number,Range> = {
            0: { min: 0, max: 1, includeUnknown: true },
            1: { min: 4, max: 5, includeUnknown: false },
        }

        expect(parseRangeQueryToNumerical(input)).toMatchObject(result)
    })

    test("indexRanges", () => {

        // TODO
        const input: Record<string, Range> = {
            "third": {
                min: 5,
                max: 7,
                includeUnknown: false,
            },
        }

        const options = {
            "first": [1,2,3],
            "second": [1,2,3],
            "third": [1,3,5,7,9],
        }

        const result = {
            // 2: [2,3,false],
            2: [5,7,false],
        }

        expect(indexRanges(input,options)).toMatchObject(result)
    })

    test("stringifyIndexedRanges", () => {

        const input: Record<number, [number, number, boolean]> = {
            0: [0, 1, true],
            1: [4, 5, false],
        }

        const result = "0:0,1,true;1:4,5"

        expect(stringifyIndexedRanges(input)).toBe(result)
    })


})
