import React from 'react'
import { Box, Text } from 'ink'
import { useBlockchainStore } from '@store/blockchain'
import { Chain } from '@store/blockchain/constants'
import { TextButton, TextButtonProps } from '@components/TextButton'
import { Button } from '@components/Button'
import { ROUTE, useNavigate } from '@src/routes'
import {
  Selection,
  SelectionZone,
  useSelectionZone,
} from '@src/components/SelectionZone'
import { COLUMNS } from '@store'
import { List } from '@src/components/List'

export const SwitchChain: React.FC = () => {
  const parentZone = useSelectionZone()!
  const navigate = useNavigate()
  const chains = useBlockchainStore((store) => store.chains)
  const setChainId = useBlockchainStore((store) => store.setChainId)

  const handleSelectChain = (chain: Chain) => {
    setChainId(chain.chainId)
  }

  const handleAddChain = () => {
    navigate(ROUTE.ADD_CHAIN)
  }

  const handleExternalChain = () => {
    navigate(ROUTE.EXTERNAL_CHAINS)
  }

  return (
    <SelectionZone
      prevKey="upArrow"
      nextKey="downArrow"
      isActive={parentZone.selection === COLUMNS.MAIN}
    >
      {(selection) => (
        <Box flexDirection="column">
          <Box marginTop={-1}>
            <Text> Switch chain </Text>
          </Box>
          <Text>Select chain or add custom</Text>
          <List viewport={5} selection={selection}>
            {chains.map((chain) => (
              <Selection<TextButtonProps>
                key={chain.chainId}
                activeProps={{ isFocused: true }}
              >
                <TextButton onPress={() => handleSelectChain(chain)}>
                  - {chain.name} [{chain.chainId}]
                </TextButton>
              </Selection>
            ))}
          </List>
          <Selection activeProps={{ isFocused: true }}>
            <Button onPress={handleAddChain}>Add chain</Button>
          </Selection>
          <Selection activeProps={{ isFocused: true }}>
            <Button onPress={handleExternalChain}>
              Select chain from external source
            </Button>
          </Selection>
        </Box>
      )}
    </SelectionZone>
  )
}
