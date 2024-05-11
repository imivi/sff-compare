import "dotenv/config"
import { z } from "zod"

const envSchema = z.object({
    CONNECTION_STRING: z.string(),
    DB_NAME: z.string(),
    DB_COLLECTION_COLUMNS: z.string(),
    DB_COLLECTION_CASES: z.string(),
    DB_COLLECTION_LOGS: z.string(),
    DB_COLLECTION_UPDATES: z.string(),
    GOOGLE_SHEET_ID: z.string().min(3),
    DEVELOPMENT: z.enum(["true", "false"]),
})


const rawEnv = envSchema.parse(process.env)

export const env = {
    ...rawEnv,
    DEVELOPMENT: rawEnv.DEVELOPMENT === "true",
}