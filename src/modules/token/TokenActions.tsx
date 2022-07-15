import React from 'react'
import { Box, Text } from 'ink'
import { ROUTE, useData, useNavigate } from '@src/routes'
import {
  Selection,
  SelectionZone,
  useSelectionZone,
} from '@src/components/SelectionZone'
import { COLUMNS } from '@src/store'
import { TextButton } from '@src/components/TextButton'

export const TokenActions: React.FC = () => {
  const { selection: parentSelection } = useSelectionZone()!
  const navigate = useNavigate()
  const token = useData<ROUTE.TOKEN_ACTIONS>()

  if (!token) {
    return <Text>Token not found</Text>
  }

  return (
    <SelectionZone
      prevKey="upArrow"
      nextKey="downArrow"
      isActive={parentSelection === COLUMNS.MAIN}
    >
      <Box flexDirection="column">
        <Box marginTop={-1}>
          <Text>
            {' '}
            {token.name} ({token.symbol}){' '}
          </Text>
        </Box>
        <Selection activeProps={{ isFocused: true }}>
          <TextButton onPress={() => navigate(ROUTE.TRANSFER, token)}>
            - Transfer
          </TextButton>
        </Selection>
        <Selection activeProps={{ isFocused: true }}>
          <TextButton onPress={() => console.log('call')}>
            - Call method
          </TextButton>
        </Selection>
      </Box>
    </SelectionZone>
  )
}
