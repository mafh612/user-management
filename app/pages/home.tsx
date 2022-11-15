import React, { Dispatch, SetStateAction, useState } from 'react'
import { Button, Grid, Paper, Typography } from '@mui/material'

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
  const gridItems = () => {
    switch (true) {
      case [Role.USER, Role.ADMIN].includes(auth?.role):
        return (
          <>
            <Grid item>
              <Paper sx={{ p: 2 }}>
                <Typography>Logout User</Typography>
                <Button onClick={logout}>Logout {auth.sub}</Button>
              </Paper>
            </Grid>
            <Grid item>
              <Paper sx={{ p: 2 }}>
                <Typography>Register User</Typography>
                <Button onClick={register}>Register</Button>
              </Paper>
            </Grid>
          </>
        )
      case auth?.role === Role.GUEST:
        return (
          <>
            <Grid item>
              <Paper sx={{ p: 2 }}>
                <Typography>Logout User</Typography>
                <Button onClick={logout}>Logout {auth.sub}</Button>
              </Paper>
            </Grid>
            <Grid item>
              <Paper sx={{ p: 2 }}>
                <Typography>Register User</Typography>
                <Button onClick={register}>Register</Button>
              </Paper>
            </Grid>
          </>
        )
      default:
        return (
          <>
            <Grid item>
              <Paper sx={{ p: 2 }}>
                <Typography>Login User</Typography>
                <Button onClick={login}>Login</Button>
              </Paper>
            </Grid>
            <Grid item>
              <Paper sx={{ p: 2 }}>
                <Typography>Register User</Typography>
                <Button onClick={register}>Register</Button>
              </Paper>
            </Grid>
          </>
        )
    }
  }

  return (
    <>
      <Grid sx={{ flexGrow: 1 }} container direction='row' justifyContent='center' spacing={6}>
        {gridItems()}
      </Grid>
      <InputUser inputUser={user as User} event={event} open={open} handleClose={handleClose} />
    </>
  )
}
