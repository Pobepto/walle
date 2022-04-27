import React from 'react'
import { Box, Text, Spacer } from 'ink'
import { useLocation, useRoutes } from './Router'
import { routes } from './routes'

export const App: React.FC = () => {
  const route = useRoutes(routes)
  const location = useLocation()

  return (
    <Box borderStyle="classic">
      <Spacer/>
      <Text>
        {location}
      </Text>
      <Box>
        {route}
      </Box>
    </Box>
  )
}
