import { Context, Next } from 'koa'
import Router, { Middleware } from '@koa/router'
import { decode, JwtPayload } from 'jsonwebtoken'

import { findAllUser, createUser, deleteUser, replaceUser, updateUser, findOneUser } from '../services/mongodb.user.service'
import { Role, User } from '../../shared'
import { validatePatchUser, validateUser } from '../middlewares/validate'
import { Filter, WithId } from 'mongodb'
import { security } from '../middlewares/security'
import { HttpRequestHeader } from 'http-enums'

const canNotSeeMap = new Map([
  [Role.ADMIN, []],
  [Role.USER, [Role.ADMIN]],
  [Role.GUEST, [Role.ADMIN, Role.USER]]
])

const getAll: Middleware = async (ctx: Context, next: Next) => {
  const payload: JwtPayload = decode(ctx.cookies.get(HttpRequestHeader.AUTHORIZATION)) as JwtPayload
  ctx.body = await findAllUser({ roles: { $nin: canNotSeeMap.get(payload?.role) } })

  return next()
}
const get: Middleware = async (ctx: Context, next: Next) => {
  const filter: Filter<WithId<User>> = ctx.params

  ctx.body = await findOneUser(filter)

  return next()
}
const save: Middleware = async (ctx: Context, next: Next) => {
  const user: User = ctx.request.body as User

  ctx.body = await createUser(user as User)

  return next()
}
const update: Middleware = async (ctx: Context, next: Next) => {
  const email: string = ctx.params.email
  const user: Partial<User> = ctx.request.body

  ctx.body = await updateUser({ email }, user)

  return next()
}
const replace: Middleware = async (ctx: Context, next: Next) => {
  const email: string = ctx.params.email
  const user: User = ctx.request.body as User

  ctx.body = await replaceUser({ email }, user)

  return next()
}
const del: Middleware = async (ctx: Context, next: Next) => {
  const email: string = ctx.params.email

  ctx.body = await deleteUser({ email })

  return next()
}

export default new Router()
  .prefix('/users')
  .get('/', security(Role.USER, Role.ADMIN), getAll)
  .get('/:email', security(Role.USER, Role.ADMIN), get)
  .post('/', security(Role.USER, Role.ADMIN), validateUser, save)
  .patch('/:email', security(Role.ADMIN), validatePatchUser, update)
  .put('/:email', security(Role.ADMIN), validateUser, replace)
  .delete('/:email', security(Role.ADMIN), del)
  .routes()
