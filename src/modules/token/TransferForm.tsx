import React from 'react'
import { InputBox } from '@src/components/InputBox'
import {
  Selection,
  SelectionZone,
  useSelectionZone,
} from '@src/components/SelectionZone'
import { Box, Text } from 'ink'
import { COLUMNS } from '@src/store'
import { Loader } from '@src/components/Loader'
import { Button } from '@src/components'
import {
  bigNumberInRange,
  combine,
  isAddress,
  isNumber,
  useForm,
} from '@src/hooks'
import { BigNumber } from '@ethersproject/bignumber'
import { formatNumber } from '@src/utils/formatNumber'

export type TransferInputs = {
  receiver: string
  amount: string
}

interface TransferFormProps {
  balance: string
  decimals: number
  balanceIsLoading: boolean
  title: string
  onBack: () => void
  onTransfer: (data: TransferInputs) => void
}

export const TransferForm: React.FC<TransferFormProps> = ({
  title,
  balance,
  decimals = 18,
  balanceIsLoading,
  onBack,
  onTransfer,
}) => {
  const parentZone = useSelectionZone()!

  const { register, data, errors, isValid } = useForm<TransferInputs>({
    rules: {
      receiver: isAddress(),
      amount: combine(
        isNumber(),
        bigNumberInRange(BigNumber.from(0), BigNumber.from(balance), decimals),
      ),
    },
    options: {
      validateAction: 'blur',
    },
  })

  return (
    <SelectionZone
      prevKey="upArrow"
      nextKey={['downArrow', 'return']}
      isActive={parentZone.selection === COLUMNS.MAIN}
    >
      <Box flexDirection="column">
        <Box marginTop={-1}>
          <Text> {title} </Text>
        </Box>
        <Selection activeProps={{ focus: true }}>
          <InputBox
            label="Receiver"
            error={errors.receiver}
            {...register('receiver')}
          />
        </Selection>
        <Text>
          <Text bold>Balance:</Text>{' '}
          <Loader loading={balanceIsLoading}>
            {formatNumber(balance, decimals, decimals)}
          </Loader>{' '}
        </Text>
        <Selection activeProps={{ focus: true }}>
          <InputBox
            type="number"
            label="Amount"
            error={errors.amount}
            loading={balanceIsLoading}
            {...register('amount')}
          />
        </Selection>
        <Selection activeProps={{ isActive: true }}>
          <SelectionZone
            prevKey="leftArrow"
            nextKey="rightArrow"
            defaultSelection={1}
          >
            <Box justifyContent="space-around">
              <Selection activeProps={{ isFocused: true }}>
                <Button onPress={onBack} minWidth="20%" paddingX={1}>
                  <Text>{'<-'} Back</Text>
                </Button>
              </Selection>
              <Selection activeProps={{ isFocused: true }}>
                <Button
                  onPress={() => onTransfer(data)}
                  minWidth="20%"
                  paddingX={1}
                  isDisabled={!isValid}
                >
                  <Text>Transfer {'->'}</Text>
                </Button>
              </Selection>
            </Box>
          </SelectionZone>
        </Selection>
      </Box>
    </SelectionZone>
  )
}
