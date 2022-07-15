import React from 'react'
import { Box, Text } from 'ink'
import { Chain, useBlockchainStore } from '@store/blockchain'
import { TextButton } from '@components/TextButton'
import { Button } from '@components/Button'
import { ROUTE, useNavigate } from '@src/routes'
import {
  Selection,
  SelectionZone,
  useSelectionZone,
} from '@src/components/SelectionZone'
import { COLUMNS } from '@src/store'

export const SwitchChain: React.FC = () => {
  const { selection: parentSelection } = useSelectionZone()!
  const navigate = useNavigate()
  const chains = useBlockchainStore((store) => store.chains)
  const setChainId = useBlockchainStore((store) => store.setChainId)

  const handleSelectChain = (chain: Chain) => {
    setChainId(chain.chainId)
  }

  const handleAddChain = () => {
    navigate(ROUTE.ADD_CHAIN)
  }

  return (
    <SelectionZone
      prevKey="upArrow"
      nextKey="downArrow"
      isActive={parentSelection === COLUMNS.MAIN}
    >
      <Box flexDirection="column">
        <Box marginTop={-1}>
          <Text> Switch chain </Text>
        </Box>
        <Text>Select chain or add custom</Text>
        {chains.map((chain) => (
          <Box key={chain.chainId}>
            <Selection activeProps={{ isFocused: true }}>
              <TextButton onPress={() => handleSelectChain(chain)}>
                - {chain.name}
              </TextButton>
            </Selection>
          </Box>
        ))}
        <Selection activeProps={{ isFocused: true }}>
          <Button onPress={handleAddChain}>Add chain</Button>
        </Selection>
      </Box>
    </SelectionZone>
  )
}
