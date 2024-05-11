// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { db } from "@/database";
import { ColumnMetadata } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";

type Response = {
    data: ColumnMetadata[],
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Response>,
) {

    res.status(200).json({
        data: await db.getColumnMetadata(),
    })
}
