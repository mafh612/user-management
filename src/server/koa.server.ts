import Router from '@koa/router'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'

import { errorHandler } from '../middlewares/error.handler'
import auth from '../routes/auth'
import root from '../routes/root'
import users from '../routes/users'

const api = new Router().prefix('/api').use(users).routes()

export const runServer: () => Promise<void> = async (): Promise<void> => {
  const app: Koa = new Koa()
  app.use(errorHandler)
  app.use(bodyParser())
  app.use(root)
  app.use(auth)
  app.use(api)
  app.listen(process.env.BE_PORT)
}
