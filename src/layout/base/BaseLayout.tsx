import React from 'react'
import { Box } from 'ink'
import { Header } from './Header'
import { MainMenu } from './MainMenu'
import { Tokens } from './Tokens'
import { Selection, SelectionZone } from '@src/components/SelectionZone'
import { useAppStore } from '@src/store'

interface Props {
  children: React.ReactNode
}

export const BaseLayout: React.FC<Props> = ({ children }) => {
  // TODO: remove activeColumn from AppStore and replace with useSelectionZone
  const setActiveColumn = useAppStore((state) => state.setActiveColumn)

  return (
    <Box flexDirection="column">
      <Header />
      <Box flexDirection="row" alignSelf="center">
        <SelectionZone
          prevKey="leftArrow"
          nextKey="rightArrow"
          isActive={true}
          onChange={setActiveColumn}
        >
          <Selection activeProps={{ borderStyle: 'doubleSingle' }}>
            <Box
              width="20%"
              flexDirection="column"
              paddingLeft={1}
              paddingRight={1}
              borderStyle="single"
            >
              <MainMenu />
            </Box>
          </Selection>

          <Selection activeProps={{ borderStyle: 'doubleSingle' }}>
            <Box
              width="60%"
              flexDirection="column"
              paddingLeft={1}
              paddingRight={1}
              borderStyle="single"
            >
              {children}
            </Box>
          </Selection>

          <Selection activeProps={{ borderStyle: 'doubleSingle' }}>
            <Box
              width="20%"
              flexDirection="column"
              paddingLeft={1}
              paddingRight={1}
              borderStyle="single"
            >
              <Tokens />
            </Box>
          </Selection>
        </SelectionZone>
      </Box>
    </Box>
  )
}
