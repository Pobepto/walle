import React from 'react'
import { Box, Text } from 'ink'
import { useChain, useWallet, useNativeBalance } from '@hooks'
import { Loader } from '@src/components/Loader'
import { useWalletStore } from '@src/store'

export const Header: React.FC = () => {
  const wallet = useWallet()
  const chain = useChain()
  const [nativeBalance, nativeBalanceIsLoading] = useNativeBalance()
  const pathId = useWalletStore((state) => state.pathId)

  // const link = `${chain.explorer}/address/${wallet.address}`

  return (
    <Box flexDirection="column" borderStyle="single" paddingX={1}>
      <Box marginTop={-1} justifyContent="space-between">
        <Text bold> {chain.name} </Text>
        <Text bold> Account {pathId + 1} </Text>
      </Box>
      <Box flexDirection="row" justifyContent="space-between">
        <Text color="cyan">{wallet?.address}</Text>
        <Text>
          <Loader loading={nativeBalanceIsLoading}>{nativeBalance}</Loader>{' '}
          {chain.currency}
        </Text>
      </Box>
    </Box>
  )
}
