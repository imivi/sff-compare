import { DeserializedFilters, Options } from "../deserializeFilters"
import { NumericalFilters, serializeFilters, stringifyFilters, stringifyNumericalFilters } from "../stringifyFilters"
import test_options from "./test_options.json"


describe("stringify filters", () => {

    // test("stringifyFilters", () => {

    //     const filters: DeserializedFilters = {
    //         "cereal": ["rye", "barley"],
    //         "fruit": ["banana"],
    //     }
    //     const options: Options = {
    //         "fruit": ["apple", "banana", "coconut"],
    //         "cereal": ["barley", "wheat", "rye"],
    //     }
    //     const output = "0:1,2;3:4,5"

    //     expect(stringifyFilters(filters,options)).toBe(output)
    // })

    test("stringifyNumericalFilters", () => {
        const input: NumericalFilters = {
            0: [1, 2],
            3: [4, 5],
        }
        const output = "0:1,2;3:4,5"

        expect(stringifyNumericalFilters(input)).toBe(output)
    })

    test("serialize to numerical", () => {

        const filters: DeserializedFilters = {
            "cereal": ["rye", "barley"],
            "fruit": ["banana"],
        }
        const options: Options = {
            "fruit": ["apple", "banana", "coconut"],
            "cereal": ["barley", "wheat", "rye"],
        }
        const output: NumericalFilters = {
            1: [2, 0],
            0: [1],
        }
        expect(serializeFilters(filters, options)).toMatchObject(output)
    })

    test("serialize to numerical 2", () => {

        const filters: DeserializedFilters = {
            "Brand": [
                "AMD",
            ],
        }
        const options: Options = {
            "Brand": ["Alpenfohn", "AMD", "Arctic"],
            "cereal": ["barley", "wheat", "rye"],
        }
        const output: NumericalFilters = {
            0: [1],
        }
        expect(serializeFilters(filters, options)).toMatchObject(output)
    })


    test("serialize to numerical 3", () => {

        const filters: DeserializedFilters = {
            "Brand": [
                "AMD",
            ],
            "Width (mm)": [
                "100"
            ]
        }
        const output: NumericalFilters = {
            0: [1],
            4: [1],
        }
        expect(serializeFilters(filters, test_options)).toMatchObject(output)
    })


    test("test stringifyFilters", () => {
        const filters = {
            "Width (mm)": [
                "100"
            ]
        }
        const output = "4:1"
        expect(stringifyFilters(filters, test_options)).toBe(output)
    })

})
