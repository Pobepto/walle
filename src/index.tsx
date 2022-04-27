import React from 'react'
import { render } from 'ink'
import { App } from './App'
import { Router } from './Router'

render(
  <Router defaultPath='ticker'>
    <App />
  </Router>
)
