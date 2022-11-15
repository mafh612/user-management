import React, { ChangeEvent, ChangeEventHandler, Dispatch, MouseEvent, MouseEventHandler, SetStateAction, useEffect, useState } from 'react'
import { Button, Dialog, DialogTitle, List, ListItem, TextField, ButtonGroup } from '@mui/material'
import { Save } from '@mui/icons-material'

import { Payload, Role, User } from '../../shared'
import { client } from '../utils/client'

interface InputUserProps {
  event?: undefined | 'login' | 'register'
  inputUser: User
  open: boolean
  handleClose(): void
  updateList?(): void
  auth?: Payload
}

export const InputUser = ({ event, handleClose, inputUser, open, updateList, auth }: InputUserProps) => {
  const [user, setUser]: [null | User, Dispatch<SetStateAction<null | User>>] = useState(null) as any
  useEffect(() => {
    setUser(inputUser)
  }, [inputUser])
  const handleLogin = async () => {
    await client.post(`/auth/login`, user)
    window.location.reload()
  }
  const handleRegister = async () => {
    await client.post(`/auth/register`, user)
    window.location.reload()
  }
  const handleUpdate = () => {
    client.patch(`/api/users/${inputUser.email}`, user)
    updateList && updateList()
    handleClose()
  }
  const handleInput: ChangeEventHandler<HTMLInputElement> = (event: ChangeEvent<HTMLInputElement>) => {
    setUser({ ...(user as User), [event.currentTarget.id]: event.currentTarget.value })
  }
  const handleClick: (role: Role) => MouseEventHandler = (role: Role) => (_event: MouseEvent) => {
    setUser({ ...(user as User), role })
  }
  const buttonVariant: (role: Role) => 'contained' | 'outlined' = (role: Role): 'contained' | 'outlined' =>
    user?.role === role ? 'contained' : 'outlined'

  const displayButton = () => {
    switch (event) {
      case 'login':
        return (
          <Button onClick={handleLogin} startIcon={<Save />}>
            Login
          </Button>
        )
      case 'register':
        return (
          <Button onClick={handleRegister} startIcon={<Save />}>
            Register
          </Button>
        )
      default:
        return (
          <Button onClick={handleUpdate} startIcon={<Save />}>
            Update
          </Button>
        )
    }
  }

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Account</DialogTitle>
      <List>
        {Boolean(event !== 'login') && (
          <>
            <ListItem>
              <TextField onChange={handleInput} id='firstname' value={user?.firstname || ''} label='Firstname' variant='outlined' />
            </ListItem>
            <ListItem>
              <TextField onChange={handleInput} id='lastname' value={user?.lastname || ''} label='Lastname' variant='outlined' />
            </ListItem>
          </>
        )}
        <ListItem>
          <TextField onChange={handleInput} id='email' value={user?.email || ''} label='Email' variant='outlined' />
        </ListItem>
        {Boolean(event) && (
          <ListItem>
            <TextField
              onChange={handleInput}
              id='password'
              type='password'
              value={user?.password || ''}
              label='Password'
              variant='outlined'
            />
          </ListItem>
        )}
        {Boolean(auth?.role === Role.ADMIN) && (
          <ListItem>
            <ButtonGroup>
              <Button variant={buttonVariant(Role.ADMIN)} onClick={handleClick(Role.ADMIN)}>
                Admin
              </Button>
              <Button variant={buttonVariant(Role.USER)} onClick={handleClick(Role.USER)}>
                User
              </Button>
              <Button variant={buttonVariant(Role.GUEST)} onClick={handleClick(Role.GUEST)}>
                Guest
              </Button>
            </ButtonGroup>
          </ListItem>
        )}
        <ListItem>{displayButton()}</ListItem>
      </List>
    </Dialog>
  )
}
