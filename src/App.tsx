import React, { useEffect } from 'react'
import { Box } from 'ink'
import { useRoute } from './routes'
import { saveUserSettings } from './utils'

export const App: React.FC = () => {
  const route = useRoute()

  useEffect(() => {
    saveUserSettings()
  }, [])

  return (
    <Box width="95%" alignSelf="center" justifyContent="center">
      {route}
    </Box>
  )
}
