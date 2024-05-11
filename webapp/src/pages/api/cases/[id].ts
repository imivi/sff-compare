import { db } from "@/database"
import { Comparison, Row } from "@/types"
import type { NextApiRequest, NextApiResponse } from "next";

// import { z } from "zod"


type Response = {
    data: Row,
} | {
    message: string,
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
    const itemId = req.query.id as string
    const sffcase = await db.getItem(itemId)
    if (sffcase) {
        delete sffcase["_id"]
        res.json({
            data: sffcase,
        })
    }
    else {
        res.status(404).json({
            message: "Case not found",
        })
    }
}
