import { Box, Text } from 'ink'
import React from 'react'
import { useNativeBalance, useTokens } from '@hooks'
import { COLUMNS, useTokensStore } from '@store'
import { Loader } from '@src/components/Loader'
import {
  Selection,
  SelectionZone,
  useSelectionZone,
} from '@src/components/SelectionZone'
import { ROUTE, useNavigate } from '@src/routes'
import { TextButton, TextButtonProps } from '@src/components/TextButton'
import { useChain } from '@src/hooks'
import { formatNumber } from '@src/utils/formatNumber'
import { List } from '@src/components/List'
import { Token } from '@src/constants'

export const Tokens: React.FC = () => {
  const parentZone = useSelectionZone()!
  const navigate = useNavigate()
  const [nativeBalance, nativeBalanceIsLoading] = useNativeBalance()
  const balances = useTokensStore((store) => store.balances)
  const tokens = useTokens()
  const chain = useChain()

  const handleSelectToken = (token: Token) => {
    navigate(ROUTE.TOKEN_ACTIONS, token)
    parentZone.select(COLUMNS.MAIN)
  }

  const handleSelectCurrency = () => {
    navigate(ROUTE.CURRENCY_ACTIONS)
    parentZone.select(COLUMNS.MAIN)
  }

  const formattedNativeBalance = nativeBalance
    ? formatNumber(nativeBalance)
    : '🤔'

  return (
    <SelectionZone
      prevKey="upArrow"
      nextKey="downArrow"
      isActive={parentZone.selection === COLUMNS.TOKENS}
    >
      {(selection) => (
        <>
          <Box alignSelf="center" marginTop={-1}>
            <Text bold> Tokens </Text>
          </Box>
          <List viewport={5} selection={selection}>
            <Selection<TextButtonProps>
              activeProps={{ underline: true, isFocused: true }}
            >
              <TextButton onPress={handleSelectCurrency}>
                <Loader loading={nativeBalanceIsLoading}>
                  {formattedNativeBalance}
                </Loader>{' '}
                <Text bold>{chain.currency}</Text>
              </TextButton>
            </Selection>
            {tokens.map((token) => {
              const balance = balances.get(token.address)
              const formattedBalance = balance?.value
                ? formatNumber(balance.value, token.decimals)
                : '🤔'

              return (
                <Selection<TextButtonProps>
                  key={`${token.chainId}${token.address}`}
                  activeProps={{ underline: true, isFocused: true }}
                >
                  <TextButton onPress={() => handleSelectToken(token)}>
                    <Loader loading={balance?.isLoading ?? true}>
                      {formattedBalance}
                    </Loader>{' '}
                    <Text bold>{token.symbol}</Text>
                  </TextButton>
                </Selection>
              )
            })}
          </List>
        </>
      )}
    </SelectionZone>
  )
}
