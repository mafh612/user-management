import AJV, { Schema } from 'ajv'
import yaml from 'yaml'
import { readFileSync } from 'fs'
import { Context, Middleware, Next } from 'koa'
import { LogReason } from '../../shared'

const ajv: AJV = new AJV({ removeAdditional: 'all' })
const schemas = yaml.parse(readFileSync('config/application.schema.yml', { encoding: 'utf8' }))
schemas.forEach((it: { schema: Schema; name: string }) => {
  ajv.addSchema(it.schema, it.name)
})

export const validateUser: Middleware = (ctx: Context, next: Next) => {
  const validation = ajv.validate('User', ctx.request.body)
  if (validation) {
    return next()
  }

  throw new Error(LogReason.VALIDATION)
}
export const validatePatchUser: Middleware = (ctx: Context, next: Next) => {
  const validation = ajv.validate('PatchUser', ctx.request.body)
  if (validation) {
    return next()
  }

  throw new Error(LogReason.VALIDATION)
}
