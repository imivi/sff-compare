import { z } from "zod"

const envSchema = z.object({
    CONNECTION_STRING: z.string(),
    DB_NAME: z.string(),
    PORT: z.string().length(4),
    DB_COLLECTION_COLUMNS: z.string(),
    DB_COLLECTION_CASES: z.string(),
    DB_COLLECTION_UPDATES: z.string(),
})

const rawEnv = envSchema.parse(process.env)

export const env = {
    ...rawEnv,
    PORT: Number(rawEnv.PORT),
}