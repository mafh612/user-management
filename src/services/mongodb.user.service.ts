import { DeleteResult, Document, Filter, InsertOneResult, Projection, UpdateResult, WithId } from 'mongodb'
import { Role, User } from '../../shared'
import { getCollection } from './mongodb.adapter'

const userCollectionName: string = process.env.MONGO_DB_USER_COLLECTION_NAME
const projection: Projection = { _id: 0 }

export const findAllUser: (filter: Filter<User>) => Promise<User[]> = async (filter: Filter<User>): Promise<User[]> =>
  getCollection<User>(userCollectionName).find(filter, { projection }).toArray()

export const findOneUser: (filter: Filter<WithId<User>>) => Promise<User> = async (filter: Filter<WithId<User>>): Promise<User> =>
  getCollection<WithId<User>>(userCollectionName).findOne(filter, { projection })

export const findOneUserWithId: (filter: Filter<WithId<User>>) => Promise<WithId<User>> = async (
  filter: Filter<WithId<User>>
): Promise<WithId<User>> => getCollection<WithId<User>>(userCollectionName).findOne(filter)

export const createUser: (user: User) => Promise<InsertOneResult<User>> = async (user: User): Promise<InsertOneResult<User>> => {
  const updated: Date = new Date()
  const created: Date = updated

  return getCollection<User>(userCollectionName).insertOne({ ...user, created, updated, role: Role.GUEST })
}

export const updateUser: (filter: Filter<WithId<User>>, user: Partial<User>) => Promise<UpdateResult> = async (
  filter: Filter<WithId<User>>,
  user: Partial<User>
): Promise<UpdateResult> => getCollection<User>(userCollectionName).updateOne(filter, { $set: { ...user, updated: new Date() } })

export const replaceUser: (filter: Filter<WithId<User>>, user: User) => Promise<Document | UpdateResult> = async (
  filter: Filter<WithId<User>>,
  user: User
): Promise<Document | UpdateResult> => getCollection<User>(userCollectionName).replaceOne(filter, { ...user, updated: new Date() })

export const deleteUser: (filter: Filter<WithId<User>>) => Promise<DeleteResult> = async (
  filter: Filter<WithId<User>>
): Promise<DeleteResult> => getCollection<User>(userCollectionName).deleteOne(filter)
