import React from 'react'
import { Box, Text } from 'ink'
import { Chain, useBlockchainStore } from '../../store/blockchain'
import { useSelection } from '../../hooks'
import { TextButton } from '../../components/TextButton'
import { Button } from '../../components/Button'

export const SwitchChain: React.FC = () => {
  const chains = useBlockchainStore((store) => store.chains)
  const setChainId = useBlockchainStore((store) => store.setChainId)
  const [selection] = useSelection(chains.length + 1, 'upArrow', 'downArrow')

  const handleSelectChain = (chain: Chain) => {
    setChainId(chain.chainId)
  }

  const handleAddChain = () => {
    // navigate(ROUTE.ADD_CHAIN)
  }

  return (
    <Box flexDirection="column">
      <Box marginTop={-1}>
        <Text> Switch chain </Text>
      </Box>
      <Text>Select chain or add custom</Text>
      {chains.map((chain, index) => (
        <Box key={chain.chainId}>
          <TextButton
            isFocused={selection === index}
            onPress={() => handleSelectChain(chain)}
          >
            - {chain.name}
          </TextButton>
        </Box>
      ))}
      <Button isFocused={selection === chains.length} onPress={handleAddChain}>
        Add chain
      </Button>
    </Box>
  )
}
