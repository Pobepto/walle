import React from 'react'
import { Box, Text } from 'ink'
import { ROUTE, useNavigate } from '../routes'
import { useAppStore } from '../store'
import { Menu, Header } from '../components'
import { useKey } from '../hooks'

interface Props {
  children: React.ReactNode
}

export const BaseLayout: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate()
  const menuFocused = useAppStore(state => state.menuFocused)
  const toggleMenu = useAppStore(state => state.toggleMenu)

  useKey('tab', toggleMenu)

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
          <Box alignSelf='center'>
            <Text bold>Menu</Text>
          </Box>
          <Menu
            focused={menuFocused}
            items={[
              {
                title: 'Wallet',
                onSelect: () => navigate(ROUTE.WALLET)
              },
              {
                title: 'DApps',
                onSelect: () => console.log('DApps')
              },
              {
                title: 'Settings',
                onSelect: () => console.log('Settings')
              }
            ]}
            prevKey='upArrow'
            nextKey='downArrow'
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
          {children}
        </Box>
      </Box>
    </Box>
  )
}
