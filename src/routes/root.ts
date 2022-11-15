import { createReadStream } from 'fs'
import { Context, Next } from 'koa'
import Router, { Middleware } from '@koa/router'

const root: Middleware = async (ctx: Context, next: Next) => {
  ctx.body = createReadStream('view/index.html')
  ctx.set('Content-Type', 'text/html')

  return next()
}
const app: Middleware = async (ctx: Context, next: Next) => {
  ctx.body = createReadStream('view/app.js')
  ctx.set('Content-Type', 'application/json')

  return next()
}

export default new Router().get('/', root).get('/app.js', app).routes()
