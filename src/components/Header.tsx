import React from 'react'
import { Box, Text } from 'ink'
import { useWallet } from '../hooks/useWallet'
import { useBlockchainStore } from '../store/blockchain'
import { useNativeBalance } from '../hooks/useNativeBalance'

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
