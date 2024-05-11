import pino from "pino"
import "pino-mongodb"
import { env } from "./env"

const transport = pino.transport({
    target: 'pino-mongodb',
    options: {
        uri: env.CONNECTION_STRING,
        database: env.DB_NAME,
        collection: env.DB_COLLECTION_LOGS,
    }
})

export const logger = pino(transport)
