import React from 'react'
import { Box, Text, useInput } from 'ink'
import { routes, useLocation, useRoutes } from './routes'
import { useAppStore } from './store'

export const App: React.FC = () => {
  const route = useRoutes(routes)
  const menuFocused = useAppStore(state => state.menuFocused)
  const toggleMenu = useAppStore(state => state.toggleMenu)
  const location = useLocation()

  useInput((_, key) => {
    if (key.tab) {
      toggleMenu()
    }
  })

  return (
    <Box flexDirection="row">
      <Box
        width="25%"
        flexDirection="column"
        borderColor={menuFocused ? 'red' : 'black'}
        borderStyle="bold"
      >
        <Text bold underline>
          Left
        </Text>
        <Text>{location}</Text>
      </Box>

      <Box
        width="75%"
        flexDirection="column"
        borderColor={!menuFocused ? 'red' : 'black'}
        borderStyle="bold"
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
