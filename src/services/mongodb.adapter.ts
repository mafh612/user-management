import { Collection, Db, MongoClient } from 'mongodb'
import { LogReason, Role } from '../../shared/enums'
import { hashPassword, logger } from '../utils'

let client: MongoClient

export const getCollection: <T>(collectionName: string) => Collection<T> = <T>(collectionName: string): Collection<T> => {
  return client.db(process.env.MONGO_DB_DATABASE_NAME).collection<T>(collectionName)
}

export const getDb: () => Db = (): Db => {
  return client.db(process.env.MONGO_DB_DATABASE_NAME)
}

export const runMongoDb: () => Promise<void> = async (): Promise<void> => {
  try {
    const mongoClient: MongoClient = await new MongoClient(process.env.MONGO_DB_CONNECTION_URI, {
      ignoreUndefined: true
    }).connect()
    const userCollection: Collection = mongoClient
      .db(process.env.MONGO_DB_DATABASE_NAME)
      .collection(process.env.MONGO_DB_USER_COLLECTION_NAME)
    await userCollection.createIndex({ email: 1 }, { unique: true })
    await userCollection.updateOne(
      { email: 'admin@mail.com' },
      {
        $set: hashPassword({
          created: new Date(),
          updated: new Date(),
          email: 'admin@mail.com',
          firstname: 'admin',
          lastname: 'admin',
          role: Role.ADMIN,
          password: 'admin'
        })
      },
      { upsert: true }
    )

    client = mongoClient
  } catch (err) {
    const { name, message } = err
    logger.error(LogReason.MONGODB, { message, name })
    throw new Error(LogReason.MONGODB)
  }
}
