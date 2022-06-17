import React from 'react'
import { render } from 'ink'
import { App } from './App'
import { Router, ROUTE } from './routes'
import singleton from './utils/singleton'

const b = singleton

render(
  <Router defaultPath={ROUTE.WELCOME}>
    <App />
  </Router>,
)
