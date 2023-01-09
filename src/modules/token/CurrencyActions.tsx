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

export const CurrencyActions: React.FC = () => {
  const navigate = useNavigate()
  const parentZone = useSelectionZone()!
  const chain = useChain()

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
        <Selection>
          {(isFocused) => (
            <TextButton
              isFocused={isFocused}
              onPress={() => navigate(ROUTE.CURRENCY_TRANSFER)}
            >
              {isFocused ? '->' : '-'} Send
            </TextButton>
          )}
        </Selection>
      </SelectionZone>
    </Box>
  )
}
