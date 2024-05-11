// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { db } from "@/database";
import { Row } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";


type Response = {
    data: Row[],
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {

    res.status(200).json({
        data: await db.getItemNames(),
    })
}
