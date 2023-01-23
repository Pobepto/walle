import React from 'react'
import { Box, Text } from 'ink'

import {
  Selection,
  SelectionZone,
  useSelectionZone,
} from '@src/components/SelectionZone'
import { TextButton } from '@src/components/TextButton'
import { useChain } from '@src/hooks'
import { ROUTE, useNavigate } from '@src/routes'
import { COLUMNS } from '@src/store'

interface CurrencyAction {
  label: string
  onPress: () => void
}

export const CurrencyActions: React.FC = () => {
  const navigate = useNavigate()
  const parentZone = useSelectionZone()!
  const chain = useChain()

  const actions: CurrencyAction[] = [
    {
      label: 'Send',
      onPress: () => navigate(ROUTE.CURRENCY_TRANSFER),
    },
  ]

  return (
    <Box flexDirection="column">
      <Box marginTop={-1}>
        <Text bold> {chain.currency} </Text>
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
