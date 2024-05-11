import { db } from "@/database"
import { env } from "@/env"
import { Comparison, Row } from "@/types"
import type { NextApiRequest, NextApiResponse } from "next";

// import { z } from "zod"


type Response = {
    // data: Row[],
    data: Record<string, any>,
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
    const query = req.query

    if (Object.keys(query).length === 0) {
        return res.json({
            data: await db.getAllItems(),
        })
    }

    let { search, page = 1, results = 25, sort, ...fieldsToQuery } = query

    // if (search && typeof search === "string") {
    //     const cases = await db.searchByCaseName(search)
    //     return res.json({
    //         data: cases,
    //     })
    // }

    page = Number(page)
    if (page < 1 || page > 100) {
        page = 1
    }

    results = Number(results)
    if (results < 25 || results > 100) {
        results = 25
    }

    const conditions: Record<string, string | Comparison> = {}

    const specialQueryFields = ["results", "page", "sort"]

    for (let [field, nameOrComparison] of Object.entries(fieldsToQuery)) {
        if (nameOrComparison) {
            nameOrComparison = nameOrComparison.toString()

            if (specialQueryFields.includes(nameOrComparison)) {
                continue
            }

            if (nameOrComparison.startsWith("$bt")) {
                const [_, min, max] = nameOrComparison.split(",")
                // const value = Number(nameOrComparison.slice(4))
                conditions[field] = {
                    $gt: Number(min),
                    $lt: Number(max),
                }
            }

            else if (nameOrComparison.startsWith("$in")) {
                const values = nameOrComparison.split(",").slice(1)
                conditions[field] = {
                    $in: values,
                }
            }

            else {
                conditions[field] = nameOrComparison
            }
        }
    }

    const sortBy = parseSort(sort as string)

    const pagesize = Number(results) ?? 10
    const skip = ((Number(page) ?? 1) - 1) * pagesize

    const items = await db.findCasesByAttributes(conditions, pagesize, skip, sortBy)
    res.json({
        data: items,
    })
}

function parseSort(sortString: string): Record<string, 1 | -1> | null {
    if (!sortString) {
        return null
    }
    const [field, ascending] = sortString.split(",")
    return {
        [field]: ascending === "1" ? 1 : -1,
    }
}
