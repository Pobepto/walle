import React from 'react'
import { Box, Text, Newline } from 'ink'
import { ROUTE, useRouteData, useNavigate } from '@src/routes'
import {
  Selection,
  SelectionZone,
  useSelectionZone,
} from '@src/components/SelectionZone'
import { COLUMNS } from '@src/store'
import { Button } from '@src/components'
import { useChain } from '@src/hooks'

export const TokenInfo: React.FC = () => {
  const navigate = useNavigate()
  const parentZone = useSelectionZone()!
  const chain = useChain()
  const token = useRouteData<ROUTE.TOKEN_INFO>()

  return (
    <SelectionZone
      prevKey="upArrow"
      nextKey="downArrow"
      isActive={parentZone.selection === COLUMNS.MAIN}
    >
      <Box flexDirection="column">
        <Box marginTop={-1}>
          <Text>
            {' '}
            {token.name} ({token.symbol}){' '}
          </Text>
        </Box>
        <Text>
          <Text bold>Name:</Text> {token.name}
        </Text>
        <Text>
          <Text bold>Symbol:</Text> {token.symbol}
        </Text>
        <Text>
          <Text bold>Address:</Text> <Text color="cyan">{token.address}</Text>
        </Text>
        <Text>
          <Text bold>Decimals:</Text> {token.decimals}
        </Text>
        <Text>
          <Text bold>Chain ID:</Text> {token.chainId}
        </Text>
        <Box marginTop={1}>
          <Text>
            <Text bold>Explorer link:</Text>
            <Newline />
            <Text color="cyan">{`${chain.explorer}/token/${token.address}`}</Text>
          </Text>
        </Box>
        <Selection activeProps={{ isFocused: true }}>
          <Button onPress={() => navigate(ROUTE.TOKEN_ACTIONS, token)}>
            <Text>{'<- '}Back</Text>
          </Button>
        </Selection>
      </Box>
    </SelectionZone>
  )
}
