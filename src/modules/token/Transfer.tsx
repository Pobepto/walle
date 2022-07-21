import React from 'react'
import { Box, Text } from 'ink'
import { ROUTE, useData, useNavigate } from '@src/routes'
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
import { useContract } from '@src/hooks/useContract'
import { ERC20_ABI } from '@src/store/blockchain/contract'

type Inputs = {
  receiver: string
  amount: string
}

export const Transfer: React.FC = () => {
  const navigate = useNavigate()
  const parentZone = useSelectionZone()!
  const token = useData<ROUTE.TOKEN_ACTIONS>()
  const balances = useTokensStore((store) => store.balances)

  // TODO: We can handle this error using ErrorBoundary in parent component
  if (!token) {
    throw new Error('Token not found')
  }

  const ERC20 = useContract(token.address, ERC20_ABI)

  const balance = balances.get(token.address) ?? '0'

  const { register, data, errors, isValid } = useForm<Inputs>({
    rules: {
      receiver: isAddress(),
      amount: combine(isNumber(), numberInRange(0, Number(balance))),
    },
    options: {
      validateAction: 'blur',
    },
  })

  const onTransfer = async () => {
    if (isValid) {
      const populatedTx = await ERC20.populateTransaction.transfer(
        data.receiver,
        data.amount,
      )

      navigate(ROUTE.CONFIRM_TRANSACTION, populatedTx)
    }
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
          <Button onPress={onTransfer}>Transfer</Button>
        </Selection>
      </Box>
    </SelectionZone>
  )
}
