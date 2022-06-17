import { Box, Text } from 'ink'
import React from 'react'
import { useKey } from '@hooks'
import { useNativeBalance } from '@hooks/useNativeBalance'
import { COLUMNS, useTokensStore } from '@store'
import { useTokens } from '@src/hooks/useTokens'
import { useCurrency } from '@src/hooks/useCurrency'
import { Loader } from '@src/components/Loader'
import {
  Selection,
  SelectionZone,
  useSelectionZone,
} from '@src/components/SelectionZone'

export const Tokens: React.FC = () => {
  const { selection: parentSelection } = useSelectionZone()!
  const [nativeBalance, nativeBalanceIsLoading] = useNativeBalance()
  const balances = useTokensStore((store) => store.balances)
  const balancesIsLoading = useTokensStore((store) => store.balancesIsLoading)
  const tokens = useTokens()
  const currency = useCurrency()

  useKey(
    'return',
    () => {
      // TODO: navigate to selected token details/actions
    },
    parentSelection === COLUMNS.TOKENS,
  )

  return (
    <SelectionZone
      prevKey="upArrow"
      nextKey="downArrow"
      isActive={parentSelection === COLUMNS.TOKENS}
    >
      <Box alignSelf="center" marginTop={-1}>
        <Text bold> Tokens </Text>
      </Box>
      <Selection activeProps={{ underline: true }}>
        <Text>
          <Text>
            <Loader loading={nativeBalanceIsLoading}>{nativeBalance}</Loader>{' '}
          </Text>
          <Text bold>{currency.symbol}</Text>
        </Text>
      </Selection>
      {tokens.map((token) => {
        const balance = balances.get(token.address)

        return (
          <Selection key={token.address} activeProps={{ underline: true }}>
            <Text>
              <Text>
                <Loader loading={balancesIsLoading}>{balance}</Loader>{' '}
              </Text>
              <Text bold>{token.symbol}</Text>
            </Text>
          </Selection>
        )
      })}
    </SelectionZone>
  )
}
