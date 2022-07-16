import React from 'react'
import { Box, Text } from 'ink'
import { ROUTE, useData } from '@src/routes'
import {
  Selection,
  SelectionZone,
  useSelectionZone,
} from '@src/components/SelectionZone'
import { COLUMNS } from '@src/store'
import { InputBox } from '@src/components/InputBox'
import { useForm } from '@src/hooks'
import { Button } from '@src/components'

type Inputs = {
  recipient: string
  amount: string
}

export const Transfer: React.FC = () => {
  const parentZone = useSelectionZone()!
  const token = useData<ROUTE.TOKEN_ACTIONS>()

  const { register } = useForm<Inputs>({})

  if (!token) {
    return <Text>Token not found</Text>
  }

  const handleTransfer = () => {
    console.log('TODO: transfer')
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
            Transfer {token.name} ({token.symbol}){' '}
          </Text>
        </Box>
        <Selection activeProps={{ focus: true }}>
          <InputBox label="Name" {...register('recipient')} />
        </Selection>
        <Selection activeProps={{ focus: true }}>
          <InputBox label="Amount" {...register('amount')} />
        </Selection>
        <Selection activeProps={{ isFocused: true }}>
          <Button onPress={handleTransfer}>Transfer</Button>
        </Selection>
      </Box>
    </SelectionZone>
  )
}
