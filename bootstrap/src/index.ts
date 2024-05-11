import { MongoClient } from "mongodb"
import { getRowsFromCsvSheets } from "./utils/get-rows-from-csv"
import { env } from "./env"
import { CustomError } from "./exceptions"
import { logger } from "./logger"
import { processRows } from "./process-rows"


async function writeCollection(client: MongoClient, collectionName: string, documents: any[]): Promise<void> {
    const db = client.db(env.DB_NAME)
    await db.dropCollection(collectionName)
    logger.info(`Dropped ${collectionName} collection`)

    const collection = await db.createCollection(collectionName)
    await collection.createIndex("id")
    logger.info(`Recreated ${collectionName} and its index`)

    await collection.insertMany(documents)
    logger.info(`Written ${documents.length} items to ${collectionName} collection`)
}

async function saveUpdateDate(client: MongoClient, columnsProcessed: number, itemsProcessed: number) {
    const db = client.db(env.DB_NAME)
    await db.collection(env.DB_COLLECTION_UPDATES).insertOne({
        date: new Date(),
        columns: columnsProcessed,
        items: itemsProcessed,
    })
}


async function main() {

    const sheetNames = [
        'SFF Case <10L',
        'SFF Case 10L-20L',
        'MFF Case >20L',
    ]

    try {
        const csvRows = await getRowsFromCsvSheets(sheetNames)
        const { rows, columnMetadata } = await processRows(csvRows)

        logger.info(`Fetched and processed ${csvRows.length} rows from google sheets`)

        const client = new MongoClient(env.CONNECTION_STRING)
        logger.info("Connected to mongodb")

        await writeCollection(client, env.DB_COLLECTION_COLUMNS, columnMetadata)
        await writeCollection(client, env.DB_COLLECTION_CASES, rows)
        await saveUpdateDate(client, columnMetadata.length, rows.length)

        logger.info("Disconnecting from mongodb")
        await client.close()

        // logger.log("OK!")

    } catch (error) {
        if (error instanceof CustomError) {
            console.error(error.message)
            logger.error(error.message)
        }
        else {
            console.error(error)
            logger.error(error)
        }
    }
}

main()
