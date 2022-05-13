import React from 'react'
import { Box } from 'ink'
import { useAppStore } from '../../store'
import { useKey } from '../../hooks'
import { Header } from './Header'
import { MainMenu } from './MainMenu'
import { Tokens } from './Tokens'

interface Props {
  children: React.ReactNode
}

export const BaseLayout: React.FC<Props> = ({ children }) => {
  const toggleMenu = useAppStore(state => state.toggleMenu)

  // TODO: Replace with useSelection hook
  useKey('tab', toggleMenu)

  return (
    <Box flexDirection="column" width="90%">
      <Header />
      <Box flexDirection="row" alignSelf='center'>
        <Box
          width="20%"
          flexDirection="column"
          borderStyle="single"
        >
          <MainMenu />
        </Box>

        <Box
          width="60%"
          flexDirection="column"
          borderStyle="single"
          marginLeft={-1}
        >
          {children}
        </Box>

        <Box
          width="20%"
          flexDirection="column"
          borderStyle="single"
          marginLeft={-1}
        >
          <Tokens />
        </Box>
      </Box>
    </Box>
  )
}
