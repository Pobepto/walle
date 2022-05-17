import { Box, Text } from 'ink'
import Spinner from 'ink-spinner'
import React from 'react'
import { useKey, useSelection } from '../../hooks'
import { useNativeBalance } from '../../hooks/useNativeBalance'
import { COLUMNS, useAppStore } from '../../store'

export const Tokens: React.FC = () => {
  const [nativeBalance, nativeBalanceIsLoading] = useNativeBalance()
  const activeColumn = useAppStore((state) => state.activeColumn)
  const [selection] = useSelection(
    2,
    'upArrow',
    'downArrow',
    activeColumn === COLUMNS.TOKENS,
    false,
  )

  useKey(
    'return',
    () => {
      // TODO: navigate to selected token details/actions
    },
    activeColumn === COLUMNS.TOKENS,
  )

  return (
    <>
      <Box alignSelf="center" marginTop={-1}>
        <Text bold> Tokens </Text>
      </Box>
      <Box>
        <Text underline={selection === 0}>
          <Text>
            {nativeBalanceIsLoading ? <Spinner type="dots" /> : nativeBalance}{' '}
          </Text>
          <Text bold>BNB</Text>
        </Text>
      </Box>
      <Box>
        <Text underline={selection === 1}>
          <Text>999,999 </Text>
          <Text bold>EYWA</Text>
        </Text>
      </Box>
    </>
  )
}
