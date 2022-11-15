import React from 'react'
import { TableCell, TableRow, Button } from '@mui/material'
import { Edit } from '@mui/icons-material'
import { User } from '../../shared/interfaces'

interface UserProps extends User {
  handleSelectUser(user: User): void
}

export const UserElement = ({ created, email, firstname, lastname, role, updated, handleSelectUser }: UserProps) => {
  return (
    <TableRow>
      <TableCell>{new Date(created as Date)?.toISOString()}</TableCell>
      <TableCell>{new Date(updated as Date)?.toISOString()}</TableCell>
      <TableCell>{firstname}</TableCell>
      <TableCell>{lastname}</TableCell>
      <TableCell>{email}</TableCell>
      <TableCell>{role}</TableCell>
      <TableCell>
        <Button startIcon={<Edit />} onClick={() => handleSelectUser({ email, firstname, lastname, role })}>
          Edit
        </Button>
      </TableCell>
    </TableRow>
  )
}
