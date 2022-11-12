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
  const parentZone = useSelectionZone()!
  const navigate = useNavigate()
  const token = useData<ROUTE.TOKEN_ACTIONS>()

  if (!token) {
    return <Text>Token not found</Text>
  }

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
        <Selection>
          {(isFocused) => (
            <TextButton
              isFocused={isFocused}
              onPress={() => navigate(ROUTE.TOKEN_TRANSFER, token)}
            >
              {isFocused ? '->' : '-'} Transfer
            </TextButton>
          )}
        </Selection>
        <Selection>
          {(isFocused) => (
            <TextButton
              isFocused={isFocused}
              onPress={() => navigate(ROUTE.TOKEN_INFO, token)}
            >
              {isFocused ? '->' : '-'} Info
            </TextButton>
          )}
        </Selection>
        <Selection>
          {(isFocused) => (
            <TextButton isFocused={isFocused} onPress={() => null}>
              {isFocused ? '->' : '-'} Call method [WIP]
            </TextButton>
          )}
        </Selection>
      </Box>
    </SelectionZone>
  )
}
