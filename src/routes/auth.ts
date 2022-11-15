import { InsertOneResult } from 'mongodb'
import { Context, Next } from 'koa'
import Router, { Middleware } from '@koa/router'
import { HttpRequestHeader } from 'http-enums'
import { decode } from 'jsonwebtoken'

import { User } from '../../shared'
import { createUser, findOneUserWithId } from '../services/mongodb.user.service'
import { createToken, hashPassword } from '../utils'

const login: Middleware = async (ctx: Context, next: Next) => {
  const body: User = hashPassword(ctx.request.body as User)

  const user = await findOneUserWithId({ email: body.email })

  if (user.password === body.password) {
    const expires: Date = new Date(new Date().setHours(24))
    ctx.cookies.set(HttpRequestHeader.AUTHORIZATION, await createToken(user, expires), {
      expires,
      httpOnly: true,
      sameSite: 'strict',
      overwrite: true
    })
  }

  ctx.body = user

  return next()
}
const register: Middleware = async (ctx: Context, next: Next) => {
  const user: User = hashPassword(ctx.request.body as User)

  const result: InsertOneResult<User> = await createUser(user)

  if (result.insertedId) {
    const expires: Date = new Date(new Date().setHours(24))
    ctx.cookies.set(HttpRequestHeader.AUTHORIZATION, await createToken(user, expires), {
      expires,
      httpOnly: true,
      sameSite: 'strict',
      overwrite: true
    })
  }

  ctx.body = result

  return next()
}

const logout: Middleware = async (ctx: Context, next: Next) => {
  const expires: Date = new Date(new Date().setHours(-1))
  ctx.cookies.set(HttpRequestHeader.AUTHORIZATION, '', { expires, httpOnly: true, sameSite: 'strict', overwrite: true })
  ctx.body = { logout: true }

  return next()
}
const reflect: Middleware = async (ctx: Context, next: Next) => {
  const payload = decode(ctx.cookies.get(HttpRequestHeader.AUTHORIZATION))
  ctx.body = payload
  ctx.set('Content-Type', 'application/json')

  return next()
}

export default new Router()
  .prefix('/auth')
  .get('/reflect', reflect)
  .post('/login', login)
  .post('/register', register)
  .get('/logout', logout)
  .routes()
