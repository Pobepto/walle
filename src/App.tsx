import React from 'react'
import { Box, Text, useInput } from 'ink'
import { ROUTE, useNavigate, useRoute } from './routes'
import { useAppStore } from './store'
import { Menu } from './components/Menu'
import { Header } from './components/Header'

export const App: React.FC = () => {
  const navigate = useNavigate()
  const route = useRoute()
  const menuFocused = useAppStore(state => state.menuFocused)
  const toggleMenu = useAppStore(state => state.toggleMenu)

  useInput((_, key) => {
    if (key.tab) {
      toggleMenu()
    }
  })

  return (
    <Box flexDirection="column">
      <Header />
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
          <Menu
            focused={menuFocused}
            items={[
              {
                title: 'Account',
                onSelect: () => navigate(ROUTE.ACCOUNT)
              },
              {
                title: 'DEX',
                onSelect: () => console.log('DEX')
              },
              {
                title: 'Settings',
                onSelect: () => console.log('Settings')
              }
            ]}
          />
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
    </Box>
  )
}
