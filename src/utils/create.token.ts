import { WithId } from 'mongodb'
import { sign, JwtPayload } from 'jsonwebtoken'

import { User } from '../../shared'
import { findOneUserWithId } from '../services/mongodb.user.service'

export const createToken = async ({ email, role }: User, expires: Date): Promise<string> => {
  const user: WithId<User> = await findOneUserWithId({ email })
  const payload: JwtPayload = {
    aud: 'www.exaple.com',
    exp: expires.getTime(),
    iat: new Date().getTime(),
    iss: 'www.example.com',
    jti: user._id.toString(),
    sub: user.email,
    role
  }

  return sign(payload, 'secretKey', { algorithm: 'HS256' })
}
