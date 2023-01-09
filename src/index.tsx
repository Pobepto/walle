import React from 'react'
import { render } from 'ink'
import { App } from './App'
import { Router, ROUTE } from './routes'

render(
  <Router defaultRoute={ROUTE.WELCOME}>
    {/* <Router defaultRoute={ROUTE.WALLET_CONNECT_REQUESTS}> */}
    <App />
  </Router>,
)
