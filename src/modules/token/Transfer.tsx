import React from 'react'
import { Box, Text } from 'ink'
import { ROUTE, useData } from '@src/routes'
import {
  Selection,
  SelectionZone,
  useSelectionZone,
} from '@src/components/SelectionZone'
import { COLUMNS, useTokensStore } from '@src/store'
import { InputBox } from '@src/components/InputBox'
import {
  combine,
  isAddress,
  isNumber,
  numberInRange,
  useForm,
} from '@src/hooks'
import { Button } from '@src/components'

type Inputs = {
  receiver: string
  amount: string
}

export const Transfer: React.FC = () => {
  const parentZone = useSelectionZone()!
  const token = useData<ROUTE.TOKEN_ACTIONS>()
  const balances = useTokensStore((store) => store.balances)

  // TODO: We can handle this error using ErrorBoundary in parent component
  if (!token) {
    throw new Error('Token not found')
  }

  const balance = balances.get(token.address) ?? '0'

  const { register, errors } = useForm<Inputs>({
    rules: {
      receiver: isAddress(),
      amount: combine(isNumber(), numberInRange(0, Number(balance))),
    },
    options: {
      validateAction: 'blur',
    },
  })

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
          <InputBox
            label="Receiver"
            error={errors.receiver}
            {...register('receiver')}
          />
        </Selection>
        <Text>Balance: {balance}</Text>
        <Selection activeProps={{ focus: true }}>
          <InputBox
            label="Amount"
            error={errors.amount}
            {...register('amount')}
          />
        </Selection>
        <Selection activeProps={{ isFocused: true }}>
          <Button onPress={handleTransfer}>Transfer</Button>
        </Selection>
      </Box>
    </SelectionZone>
  )
}
