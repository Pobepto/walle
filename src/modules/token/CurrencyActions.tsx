import React from 'react'
import { Box, Text } from 'ink'
import { useNavigate } from '@src/routes'
import {
  Selection,
  SelectionZone,
  useSelectionZone,
} from '@src/components/SelectionZone'
import { COLUMNS } from '@src/store'
import { TextButton } from '@src/components/TextButton'
import { useChain } from '@src/hooks'

export const CurrencyActions: React.FC = () => {
  const parentZone = useSelectionZone()!
  const chain = useChain()

  return (
    <SelectionZone
      prevKey="upArrow"
      nextKey="downArrow"
      isActive={parentZone.selection === COLUMNS.MAIN}
    >
      <Box flexDirection="column">
        <Box marginTop={-1}>
          <Text> {chain.currency} [WIP] </Text>
        </Box>
        <Selection activeProps={{ isFocused: true }}>
          <TextButton onPress={() => null}>- Send [WIP]</TextButton>
        </Selection>
      </Box>
    </SelectionZone>
  )
}
