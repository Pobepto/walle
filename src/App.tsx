import React, { useEffect } from 'react'
import { Box } from 'ink'

import { useRoute } from '@src/routes'
import { runStoreAutosave } from '@src/store'

export const App: React.FC = () => {
  const route = useRoute()

  useEffect(() => {
    runStoreAutosave()
  }, [])

  return (
    <Box width="95%" alignSelf="center" justifyContent="center">
      {route}
    </Box>
  )
}
