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

interface TokenAction {
  label: string
  onPress: () => void
}

export const TokenActions: React.FC = () => {
  const parentZone = useSelectionZone()!
  const navigate = useNavigate()
  const token = useRouteData<ROUTE.TOKEN_ACTIONS>()

  const actions: TokenAction[] = [
    {
      label: 'Transfer',
      onPress: () => navigate(ROUTE.TOKEN_TRANSFER, token),
    },
    {
      label: 'Info',
      onPress: () => navigate(ROUTE.TOKEN_INFO, token),
    },
    // {
    //   label: 'Call',
    //   onPress: () => null,
    // },
  ]

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
        {actions.map((action) => (
          <Selection key={action.label}>
            {(isFocused) => (
              <TextButton isFocused={isFocused} onPress={action.onPress}>
                {isFocused ? '->' : '-'} {action.label}
              </TextButton>
            )}
          </Selection>
        ))}
      </SelectionZone>
    </Box>
  )
}
