import React from 'react'
import { Box, Text } from 'ink'
import { useChain, useWallet } from '@hooks'
import { Loader } from '@src/components/Loader'
import { useBlockchainStore, useWalletStore } from '@src/store'
import { formatNumber } from '@src/utils/formatNumber'

export const Header: React.FC = () => {
  const wallet = useWallet()
  const chain = useChain()
  const nativeBalance = useBlockchainStore((store) => store.nativeBalance)
  const pathId = useWalletStore((state) => state.pathId)

  // const link = `${chain.explorer}/address/${wallet.address}`
  const formattedBalance = nativeBalance
    ? formatNumber(nativeBalance, 18, 18)
    : '🤔'

  return (
    <Box flexDirection="column" borderStyle="single" paddingX={1}>
      <Box marginTop={-1} justifyContent="space-between">
        <Text bold> {chain.name} </Text>
        <Text bold> Account {pathId + 1} </Text>
      </Box>
      <Box flexDirection="row" justifyContent="space-between">
        <Text color="cyan">{wallet?.address}</Text>
        <Text>
          <Loader loading={!nativeBalance}>{formattedBalance}</Loader>{' '}
          {chain.currency}
        </Text>
      </Box>
    </Box>
  )
}
