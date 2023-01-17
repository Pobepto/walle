import React from 'react'
import { Box, Text } from 'ink'
import { ROUTE, useNavigate } from '@src/routes'
import {
  Selection,
  SelectionZone,
  useSelectionZone,
} from '@src/components/SelectionZone'
import { COLUMNS } from '@src/store'
import { TextButton } from '@src/components/TextButton'
import { useChain } from '@src/hooks'

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
        <Text> {chain.currency} </Text>
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
