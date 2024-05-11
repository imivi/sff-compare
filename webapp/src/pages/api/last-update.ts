import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/database";


type Response = {
    date: Date | null,
    message?: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {

    const date = await db.getLastUpdateDate()

    if (!date) {
        res.status(404).json({
            date: null,
            message: "Not found",
        })
    }
    res.status(200).json({
        date,
    })
}
