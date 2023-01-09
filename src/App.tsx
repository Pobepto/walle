import React from 'react'
import { Box } from 'ink'
import { useRoute } from './routes'
import { subscribe } from './store/subscribers'

// 🤔
subscribe()

export const App: React.FC = () => {
  // Temporary disable auto save
  // useAutoSave()
  const route = useRoute()

  return (
    <Box width="95%" alignSelf="center" justifyContent="center">
      {route}
    </Box>
  )
}
