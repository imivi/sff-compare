import { MongoClient } from "mongodb"
import { CaseName, ColumnMetadata, Comparison, Row } from "./types"
import { env } from "./env"


const client = new MongoClient(env.CONNECTION_STRING)
const database = client.db(env.DB_NAME)


async function getColumnMetadata() {
    return database.collection<ColumnMetadata>(env.DB_COLLECTION_COLUMNS).find().toArray()
}

async function getItemNames(): Promise<CaseName[]> {
    const fieldsToReturn = {
        _id: 0,
        id: 1,
        seller: 1,
        case: 1,
    }
    const items = await database.collection<CaseName>(env.DB_COLLECTION_CASES).find({}, { projection: fieldsToReturn }).toArray()
    return items
}

async function getAllItems() {
    return database.collection<Row>(env.DB_COLLECTION_CASES).find().toArray()
}

async function getItem(itemId: string): Promise<Row | undefined> {
    const items = await database.collection<Row>(env.DB_COLLECTION_CASES).find({ id: itemId }).toArray()
    return items[0]
}


async function findCasesByAttributes(
    conditions: Record<string, string | Comparison>,
    limit: number,
    skip: number,
    sort: null | Record<string, 1 | -1>
) {
    if (sort) {
        return database.collection(env.DB_COLLECTION_CASES).find(conditions).skip(skip).limit(limit).sort(sort).toArray()
    }
    return database.collection(env.DB_COLLECTION_CASES).find(conditions).skip(skip).limit(limit).toArray()
}


type UpdateDate = {
    date: Date
}

async function getLastUpdateDate(): Promise<Date> {
    const lastUpdates = await database.collection<UpdateDate>(env.DB_COLLECTION_UPDATES).find().sort({ date: 1 }).limit(1).toArray()
    return lastUpdates[0]?.date
}

export const db = {
    getColumnMetadata,
    getAllItems,
    getItem,
    findCasesByAttributes,
    getItemNames,
    getLastUpdateDate,
}