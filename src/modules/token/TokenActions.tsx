import React from 'react'
import { Box, Text } from 'ink'

import {
  Selection,
  SelectionZone,
  useSelectionZone,
} from '@src/components/SelectionZone'
import { TextButton } from '@src/components/TextButton'
import { COLUMNS } from '@src/constants'
import { ROUTE, useNavigate, useRouteData } from '@src/routes'

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
        <Text bold>
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
