import React from 'react'
import { Box, Button, Stack, ThemeProvider, Typography, createTheme } from '@mui/material'
import { AccountCircleOutlined, Home as HomeIcon } from '@mui/icons-material'
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom'

const LinkBehavior = React.forwardRef<HTMLAnchorElement, Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }>(
  ({ href, ...other }, ref) => <RouterLink ref={ref} to={href} {...other} />
)

export const theme = createTheme({
  components: {
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior
      }
    }
  }
})

export const Navigation = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box marginBottom={2}>
        <Stack direction='row' justifyContent='center' alignItems='center' spacing={2}>
          <Button href='/' variant='contained' startIcon={<HomeIcon />}>
            <Typography>Home</Typography>
          </Button>
          <Button href='/users' variant='outlined' startIcon={<AccountCircleOutlined />}>
            <Typography>Users</Typography>
          </Button>
        </Stack>
      </Box>
    </ThemeProvider>
  )
}
