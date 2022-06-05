import { Box, Text } from 'ink'
import React from 'react'
import { useKey, useSelection } from '@hooks'
import { useNativeBalance } from '@hooks/useNativeBalance'
import { COLUMNS, useAppStore, useTokensStore } from '@store'
import { useTokens } from '@src/hooks/useTokens'
import { useCurrency } from '@src/hooks/useCurrency'
import { Loader } from '@src/components/Loader'

export const Tokens: React.FC = () => {
  const activeColumn = useAppStore((state) => state.activeColumn)
  const [nativeBalance, nativeBalanceIsLoading] = useNativeBalance()
  const balances = useTokensStore((store) => store.balances)
  const balancesIsLoading = useTokensStore((store) => store.balancesIsLoading)
  const tokens = useTokens()
  const currency = useCurrency()

  const [selection] = useSelection(
    tokens.length + 1,
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
      <Text underline={selection === 0}>
        <Text>
          <Loader loading={nativeBalanceIsLoading}>{nativeBalance}</Loader>{' '}
        </Text>
        <Text bold>{currency.symbol}</Text>
      </Text>
      {tokens.map((token, index) => {
        const tokenId = `${token.chainId}${token.address}`
        const balance = balances.get(tokenId)

        return (
          <Text key={tokenId} underline={selection === index + 1}>
            <Text>
              <Loader loading={balancesIsLoading}>{balance}</Loader>{' '}
            </Text>
            <Text bold>{token.symbol}</Text>
          </Text>
        )
      })}
    </>
  )
}
