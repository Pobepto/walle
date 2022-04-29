import React from 'react'
import { useRoute } from './routes'

export const App: React.FC = () => {
  const route = useRoute()

  return route
}
