import React, { Dispatch, SetStateAction, useState } from 'react'
import { Box, Button, ButtonGroup } from '@mui/material'

import { InputUser } from '../components/input.user'
import { client } from '../utils/client'
import { User, Role, Payload } from '../../shared'

type AuthEvent = undefined | 'login' | 'register'
interface HomeProps {
  auth: Payload
}
export const Home = ({ auth }: HomeProps) => {
  const [open, setOpen]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(false)
  const handleClose = () => {
    setOpen(false)
  }

  const [user, setUser]: [null | User, Dispatch<SetStateAction<null | User>>] = useState(null) as any
  const [event, setEvent]: [AuthEvent, Dispatch<SetStateAction<AuthEvent>>] = useState(null) as any
  const logout = () => {
    client.get('/auth/logout')
    window.location.reload()
  }
  const login = () => {
    setEvent('login')
    setUser(Object.create({}))
    setOpen(true)
  }
  const register = () => {
    setEvent('register')
    setUser(Object.create({}))
    setOpen(true)
  }
  const pickButtons = () => {
    switch (true) {
      case [Role.USER, Role.ADMIN].includes(auth?.role):
        return (
          <>
            <Button onClick={logout}>Logout {auth.sub}</Button>
            <Button onClick={register}>Register</Button>
          </>
        )
      case auth?.role === Role.GUEST:
        return (
          <>
            <Button onClick={logout}>Logout {auth.sub}</Button>
          </>
        )
      default:
        return (
          <>
            <Button onClick={login}>Login</Button>
            <Button onClick={register}>Register</Button>
          </>
        )
    }
  }
  return (
    <>
      <Box>
        <ButtonGroup orientation='vertical' aria-label='vertical contained button group' variant='contained'>
          {pickButtons()}
        </ButtonGroup>
      </Box>
      <InputUser inputUser={user as User} event={event} open={open} handleClose={handleClose} />
    </>
  )
}
