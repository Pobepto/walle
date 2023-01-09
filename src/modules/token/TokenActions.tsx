import React from 'react'
import { Box, Text } from 'ink'
import { ROUTE, useRouteData, useNavigate } from '@src/routes'
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
  const token = useRouteData<ROUTE.TOKEN_ACTIONS>()

  return (
    <Box flexDirection="column">
      <Box marginTop={-1}>
        <Text>
          {' '}
          {token.name} ({token.symbol}){' '}
        </Text>
      </Box>
      <SelectionZone
        prevKey="upArrow"
        nextKey="downArrow"
        isActive={parentZone.selection === COLUMNS.MAIN}
      >
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
        {/* <Selection>
          {(isFocused) => (
            <TextButton isFocused={isFocused} onPress={() => null}>
              {isFocused ? '->' : '-'} Call method [WIP]
            </TextButton>
          )}
        </Selection> */}
      </SelectionZone>
    </Box>
  )
}
