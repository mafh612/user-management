import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { Payload } from '../shared'
import { Routes, Route } from 'react-router'

import { ErrorPopover } from './components/error.popover'
import { Home } from './pages/home'
import { Navigation } from './components/navigation'
import { Users } from './pages/users'
import { client } from './utils/client'

const App = () => {
  const [auth, setAuth]: [null | Payload, Dispatch<SetStateAction<null | Payload>>] = useState(null) as any
  useEffect(() => {
    client.get('/auth/reflect').then((payload) => {
      setAuth(payload)
    })
  }, [])

  return (
    <>
      <Router>
        <Navigation />
        <Routes>
          <Route path='/users' element={<Users auth={auth as Payload} />} />
          <Route path='/' element={<Home auth={auth as Payload} />} />
        </Routes>
      </Router>
      <ErrorPopover />
    </>
  )
}

const container = ReactDOM.createRoot(document.querySelector('#app') as Element)
container.render(<App />)
