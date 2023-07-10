import { compareValues } from "./compareValues"

describe("sorting", () => {

    test("sort(5,-)", () => {
        const result = compareValues(5, "-", true)
        return expect(result).toBe(-1)
    })

    test("sort(-,3)", () => {
        const result = compareValues("-", 3, true)
        return expect(result).toBe(1)
    })

    test("sort(5,3,asc)", () => {
        const result = compareValues(5, 3, true)
        return expect(result).toBe(1)
    })

    test("sort(5,3,desc)", () => {
        const result = compareValues(5, 3, false)
        return expect(result).toBe(-1)
    })

    test("sort(5,20,asc)", () => {
        const result = compareValues(5, 20, true)
        return expect(result).toBe(-1)
    })

    test("sort(5,'20',desc)", () => {
        const result = compareValues(5, "20", true)
        return expect(result).toBe(0)
    })

    test("sort('20',3,asc)", () => {
        const result = compareValues("20", 3, true)
        return expect(result).toBe(0)
    })
})