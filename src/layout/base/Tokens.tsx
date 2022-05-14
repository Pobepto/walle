import { Box, Text } from 'ink'
import Spinner from 'ink-spinner'
import React from 'react'
import { useNativeBalance } from '../../hooks/useNativeBalance'

export const Tokens: React.FC = () => {
  const [nativeBalance, nativeBalanceIsLoading] = useNativeBalance()

  return (
    <>
      <Box alignSelf="center">
        <Text bold>Tokens</Text>
      </Box>
      <Box>
        <Text>
          {nativeBalanceIsLoading ? <Spinner type="dots" /> : nativeBalance}{' '}
        </Text>
        <Text bold>BNB</Text>
      </Box>
      <Box>
        <Text>999,999 </Text>
        <Text bold>EYWA</Text>
      </Box>
    </>
  )
}
