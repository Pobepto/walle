import React from 'react'
import { Box, Text } from 'ink'
import { useWallet, useNativeBalance, useLoading } from '../hooks'
import { useBlockchainStore } from '../store/blockchain'

export const Header: React.FC = () => {
  const wallet = useWallet()
  const chainId = useBlockchainStore(store => store.chainId)
  const chains = useBlockchainStore(store => store.chains)
  const { data: nativeBalance, isLoading } = useLoading<string>()
  // const nativeBalance = useNativeBalance(chainId)

  const chain = chains.find(c => c.chainId === chainId)

  return (
    <Box flexDirection="column" borderStyle="single">
      <Box>
        <Text>{chain.name}</Text>
      </Box>
      <Box flexDirection="row" justifyContent="space-between">
        <Text>{wallet?.address}</Text>
        <Text>{nativeBalance} {chain.currency.symbol}</Text>
      </Box>
    </Box>
  )
}
