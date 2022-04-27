import React from 'react'
import { Box, Text } from 'ink'
import { useLocation, useRoutes } from './Router'
import { routes } from './routes'

export const App: React.FC = () => {
  const route = useRoutes(routes)
  const location = useLocation()

  return (
    <Box flexDirection="row">
      <Box
        width="25%"
        flexDirection="column"
        borderColor="red"
        borderStyle='bold'
      >
        <Text bold underline>
          Left
        </Text>
        <Text>{location}</Text>
      </Box>

      <Box
        width="75%"
        flexDirection="column"
        borderColor="red"
        borderStyle='bold'
        marginLeft={-1}
      >
        <Text bold underline>
          Right
        </Text>
        {route}
      </Box>
    </Box>
  )
}
