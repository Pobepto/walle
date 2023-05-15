import React from 'react'
import { Box, Newline, Text } from 'ink'

import { Button } from '@src/components'
import { useSelectionZone } from '@src/components/SelectionZone'
import { COLUMNS } from '@src/constants'
import { useChain } from '@src/hooks'
import { ROUTE, useNavigate, useRouteData } from '@src/routes'

export const TokenInfo: React.FC = () => {
  const navigate = useNavigate()
  const parentZone = useSelectionZone()!
  const chain = useChain()
  const token = useRouteData<ROUTE.TOKEN_INFO>()

  return (
    <Box flexDirection="column">
      <Box marginTop={-1}>
        <Text bold>
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
          <Text color="cyan">{`${chain.explorer}token/${token.address}`}</Text>
        </Text>
      </Box>
      <Button
        isFocused={parentZone.selection === COLUMNS.MAIN}
        onPress={() => navigate(ROUTE.TOKEN_ACTIONS, token)}
      >
        <Text>{'<- '}Back</Text>
      </Button>
    </Box>
  )
}
