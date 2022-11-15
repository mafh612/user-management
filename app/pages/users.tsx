import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { Replay } from '@mui/icons-material'

import { User, Payload } from '../../shared'
import { UserElement } from '../components/user'
import { client } from '../utils/client'
import { InputUser } from '../components/input.user'

interface UsersProps {
  auth?: Payload
}

export const Users = ({ auth }: UsersProps) => {
  const [open, setOpen]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(false)
  const handleClose = () => {
    setOpen(false)
  }
  const [users, setUsers]: [undefined | User[], Dispatch<SetStateAction<undefined | User[]>>] = useState()
  const [selectedUser, setSelectedUser]: [undefined | User, Dispatch<SetStateAction<undefined | User>>] = useState()
  const handleSelectUser = (user: User) => {
    setSelectedUser(user)
    setOpen(true)
  }
  const updateList = () => {
    client.get('/api/users').then((data: User[]) => {
      setUsers(data)
    })
  }

  useEffect(() => {
    client.get('/api/users').then((data: User[]) => {
      setUsers(data)
    })
  }, [])

  return (
    <>
      <Button onClick={updateList}>
        <Replay />
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>created</TableCell>
              <TableCell>last updated</TableCell>
              <TableCell>Firstname</TableCell>
              <TableCell>Lastname</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Roles</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(Array.isArray(users) &&
              users.map((user) => <UserElement key={`user_${user.email}`} {...user} handleSelectUser={handleSelectUser} />)) || (
              <TableRow>
                <TableCell colSpan={7} align='center'>
                  no data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <InputUser inputUser={selectedUser as User} open={open} handleClose={handleClose} updateList={updateList} auth={auth} />
    </>
  )
}
