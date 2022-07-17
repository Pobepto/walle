import { Box } from 'ink'
import React from 'react'
import { useRoute } from './routes'

export const App: React.FC = () => {
  const route = useRoute()

  return (
    <Box width="95%" alignSelf="center" justifyContent="center">
      {route}
    </Box>
  )
}
