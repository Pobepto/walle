import React from 'react'
import { Box } from 'ink'
import { Header } from './Header'
import { MainMenu } from './MainMenu'
import { Tokens } from './Tokens'
import { Selection, SelectionZone } from '@src/components/SelectionZone'
import { Footer } from './Footer'
import { WalletConnectHandler } from '../WalletConnectHandler'

interface Props {
  children: React.ReactNode
}

const activeBoxProps = { borderStyle: 'double', borderColor: 'cyan' }

export const BaseLayout: React.FC<Props> = ({ children }) => (
  <Box flexDirection="column">
    <Header />
    <Box flexDirection="row" alignSelf="center" minHeight={20}>
      <SelectionZone nextKey="tab" isActive looped>
        <WalletConnectHandler />

        <Selection activeProps={activeBoxProps}>
          <Box
            width="20%"
            flexDirection="column"
            paddingX={1}
            borderStyle="single"
          >
            <MainMenu />
          </Box>
        </Selection>

        <Selection activeProps={activeBoxProps}>
          <Box
            width="60%"
            flexDirection="column"
            paddingX={1}
            borderStyle="single"
          >
            {children}
          </Box>
        </Selection>

        <Selection activeProps={activeBoxProps}>
          <Box
            width="20%"
            flexDirection="column"
            paddingX={1}
            borderStyle="single"
          >
            <Tokens />
          </Box>
        </Selection>
      </SelectionZone>
    </Box>
    <Footer />
  </Box>
)
