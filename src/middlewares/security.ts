import { HttpRequestHeader, HttpStatus } from 'http-enums'
import { Context, Middleware, Next } from 'koa'
import { decode } from 'jsonwebtoken'
import { Role, Payload } from '../../shared'

export const security =
  (...roles: Role[]): Middleware =>
  (ctx: Context, next: Next) => {
    const token = ctx.cookies.get(HttpRequestHeader.AUTHORIZATION)
    let error: Error

    if (!token) {
      error = new Error('UNAUTHORIZED')
      error.name = HttpStatus.UNAUTHORIZED.toString()
      error.message = 'token missing'

      throw error
    }

    const payload: Payload = decode(token) as Payload

    if (!payload) {
      error = new Error('UNAUTHORIZED')
      error.name = HttpStatus.UNAUTHORIZED.toString()
      error.message = 'token invalid'
    }

    if (!roles.includes(payload?.role)) {
      error = new Error('FORBIDDEN')
      error.name = HttpStatus.FORBIDDEN.toString()
      error.message = 'access not allowed'
    }

    if (error) throw error

    return next()
  }
