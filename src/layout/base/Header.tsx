import React from 'react'
import { Box, Text } from 'ink'
import { useChain, useWallet, useNativeBalance } from '@hooks'
import { Loader } from '@src/components/Loader'

export const Header: React.FC = () => {
  const wallet = useWallet()
  const chain = useChain()
  const [nativeBalance, nativeBalanceIsLoading] = useNativeBalance()

  // const link = `${chain.explorer}/address/${wallet.address}`

  return (
    <Box
      flexDirection="column"
      borderStyle="single"
      paddingLeft={1}
      paddingRight={1}
    >
      <Box marginTop={-1}>
        <Text bold> {chain.name} </Text>
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
