import React from 'react'
import { Box, Text } from 'ink'
import { useWallet, useNativeBalance } from '../hooks'
import { useBlockchainStore } from '../store/blockchain'

export const Header: React.FC = () => {
  const wallet = useWallet()
  const chainId = useBlockchainStore(store => store.chainId)
  const nativeBalance = useNativeBalance(chainId)

  return (
    <Box flexDirection="column" borderStyle="classic" borderColor="cyan">
      <Text>ChainId: {chainId}</Text>
      <Text>Account: {wallet?.address}</Text>
      <Text>Balance: {nativeBalance ?? '???'}</Text>
    </Box>
  )
}
