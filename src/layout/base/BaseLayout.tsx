import React, { useEffect } from 'react'
import { Box } from 'ink'
import { COLUMNS, useAppStore } from '../../store'
import { useSelection } from '../../hooks'
import { Header } from './Header'
import { MainMenu } from './MainMenu'
import { Tokens } from './Tokens'
import { useBlockchainStore } from '../../store/blockchain'

interface Props {
  children: React.ReactNode
}

const LAYOUT_COLUMNS = 3

export const BaseLayout: React.FC<Props> = ({ children }) => {
  const getNativeBalance = useBlockchainStore((store) => store.getNativeBalance)
  const setActiveColumn = useAppStore((state) => state.setActiveColumn)
  const [selection] = useSelection(
    LAYOUT_COLUMNS,
    'leftArrow',
    'rightArrow',
    true,
    false,
  )

  useEffect(() => {
    setActiveColumn(selection)
  }, [selection])

  useEffect(() => {
    getNativeBalance()

    setTimeout(() => {
      getNativeBalance()
    }, 3000)
  }, [])

  return (
    <Box flexDirection="column">
      <Header />
      <Box flexDirection="row" alignSelf="center">
        <Box
          width="20%"
          flexDirection="column"
          paddingLeft={1}
          paddingRight={1}
          borderStyle={selection === COLUMNS.MENU ? 'doubleSingle' : 'single'}
        >
          <MainMenu />
        </Box>

        <Box
          width="60%"
          flexDirection="column"
          paddingLeft={1}
          paddingRight={1}
          borderStyle={selection === COLUMNS.MAIN ? 'doubleSingle' : 'single'}
        >
          {children}
        </Box>

        <Box
          width="20%"
          flexDirection="column"
          paddingLeft={1}
          paddingRight={1}
          borderStyle={selection === COLUMNS.TOKENS ? 'doubleSingle' : 'single'}
        >
          <Tokens />
        </Box>
      </Box>
    </Box>
  )
}
