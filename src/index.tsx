import React from 'react'
import { render } from 'ink'

import { App } from './App'
import { ROUTE, Router } from './routes'

render(
  <Router defaultRoute={ROUTE.WELCOME}>
    <App />
  </Router>,
)
