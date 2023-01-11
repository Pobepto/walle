import React, { useEffect, useState } from 'react'
import { Box } from 'ink'
import { useRoute } from './routes'
import { subscribe } from './store/subscribers'
import { initSignClient } from './wallet-connect'

// 🤔
subscribe()

export const App: React.FC = () => {
  // Temporary disable auto save
  // useAutoSave()
  const route = useRoute()

  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    initSignClient().then(() => {
      setInitialized(true)
    })
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
