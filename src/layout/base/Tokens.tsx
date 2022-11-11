import { Box, Text } from 'ink'
import React from 'react'
import { useNativeBalance, useTokens } from '@hooks'
import { COLUMNS, Token, useTokensStore } from '@store'
import { Loader } from '@src/components/Loader'
import {
  Selection,
  SelectionZone,
  useSelectionZone,
} from '@src/components/SelectionZone'
import { ROUTE, useNavigate } from '@src/routes'
import { TextButton } from '@src/components/TextButton'
import { useChain } from '@src/hooks'

export const Tokens: React.FC = () => {
  const parentZone = useSelectionZone()!
  const navigate = useNavigate()
  const [nativeBalance, nativeBalanceIsLoading] = useNativeBalance()
  const balances = useTokensStore((store) => store.balances)
  const balancesIsLoading = useTokensStore((store) => store.balancesIsLoading)
  const tokens = useTokens()
  const chain = useChain()

  const handleSelectToken = (token: Token) => {
    navigate(ROUTE.TOKEN_ACTIONS, token)
    parentZone.select(COLUMNS.MAIN)
  }

  const handleSelectCurrency = () => {
    // TODO: create CURRENCY_ACTIONS route
    // navigate(ROUTE.CURRENCY_ACTIONS, currency)
    parentZone.select(COLUMNS.MAIN)
  }

  return (
    <SelectionZone
      prevKey="upArrow"
      nextKey="downArrow"
      isActive={parentZone.selection === COLUMNS.TOKENS}
    >
      <Box alignSelf="center" marginTop={-1}>
        <Text bold> Tokens </Text>
      </Box>
      <Selection activeProps={{ underline: true, isFocused: true }}>
        <TextButton onPress={handleSelectCurrency}>
          <Text>
            <Loader loading={nativeBalanceIsLoading}>{nativeBalance}</Loader>{' '}
          </Text>
          <Text bold>{chain.currency}</Text>
        </TextButton>
      </Selection>
      {tokens.map((token) => {
        const balance = balances.get(token.address)

        return (
          <Selection
            key={`${token.name}${token.address}`}
            activeProps={{ underline: true, isFocused: true }}
          >
            <TextButton onPress={() => handleSelectToken(token)}>
              <Text>
                <Loader loading={balancesIsLoading}>{balance}</Loader>{' '}
              </Text>
              <Text bold>{token.symbol}</Text>
            </TextButton>
          </Selection>
        )
      })}
    </SelectionZone>
  )
}
