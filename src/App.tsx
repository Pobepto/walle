import React, { useEffect, useState } from 'react'
import { Box } from 'ink'
import { useRoute } from './routes'
import { subscribe } from './store/subscribers'
import { saveUserSettings } from './utils'

// 🤔
subscribe()

export const App: React.FC = () => {
  const route = useRoute()

  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    saveUserSettings()
    setInitialized(true)
  }, [])

  if (!initialized) {
    return null
  }

  return (
    <Box width="95%" alignSelf="center" justifyContent="center">
      {route}
    </Box>
  )
}
