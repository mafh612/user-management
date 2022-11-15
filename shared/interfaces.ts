import { JwtPayload } from 'jsonwebtoken'

import { Role } from './enums'

export interface User {
  firstname: string
  lastname: string
  email: string
  created?: Date
  updated?: Date
  role: Role
  password?: string
}
export interface Payload extends JwtPayload {
  role: Role
}
