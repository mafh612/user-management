import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Snackbar, Alert, IconButton } from '@mui/material'
import { Close } from '@mui/icons-material'
import { subscribeToErrors } from '../utils/handle.error'

export const ErrorPopover = () => {
  const [error, setError]: [undefined | Error, Dispatch<SetStateAction<undefined | Error>>] = useState()
  const [open, setOpen]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(false)
  useEffect(() => {
    subscribeToErrors(async (errorResponse: Response) => {
      const data: Promise<Error> = await (errorResponse?.json && errorResponse?.json())
      setError(await data)
      setOpen(true)
    })
  }, [])
  const handleClose = () => {
    setOpen(false)
  }
  const closeAction = (
    <IconButton size='small' aria-label='close' color='inherit' onClick={handleClose}>
      <Close fontSize='small' />
    </IconButton>
  )

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} action={closeAction}>
      <Alert severity='error'>
        <h3>{error?.name}</h3>
        <small>{error?.message}</small>
      </Alert>
    </Snackbar>
  )
}
