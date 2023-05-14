import React, { useState } from 'react'
import { Box, Text } from 'ink'
import { Nullable } from 'tsdef'

import { Button, ButtonProps } from '@src/components'
import { InputBox, InputBoxProps } from '@src/components/InputBox'
import { Loader } from '@src/components/Loader'
import {
  Selection,
  SelectionZone,
  SelectionZoneProps,
  useSelectionZone,
} from '@src/components/SelectionZone'
import { COLUMNS } from '@src/constants'
import {
  bigNumberInRange,
  combine,
  isAddress,
  isENS,
  isNumber,
  useDidMountEffect,
  useENS,
  useForm,
} from '@src/hooks'
import { formatNumber } from '@src/utils/formatNumber'

export type TransferInputs = {
  receiver: string
  amount: string
}

interface TransferFormProps {
  balance: Nullable<string>
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
  const [isExistENS, setExistENS] = useState(false)

  const { register, data, errors, isValid } = useForm<TransferInputs>({
    initialValues: {
      receiver: '',
      amount: '',
    },
    rules: {
      receiver: (value, data) => {
        if (!isExistENS) {
          if (isENS(value)) {
            return 'Address for this name not found'
          }

          return isAddress()(value, data)
        }
      },
      amount: combine(isNumber(), bigNumberInRange(0, balance ?? 0, decimals)),
    },
    validateAction: 'blur',
  })

  const { loading: loadingENS, address: resolvedAddress } = useENS(
    data.receiver,
  )

  useDidMountEffect(() => {
    setExistENS(!!resolvedAddress)
  }, [resolvedAddress])

  const formattedBalance = balance
    ? formatNumber(balance, decimals, decimals)
    : '🤔'

  return (
    <SelectionZone
      prevKey="upArrow"
      nextKey={['downArrow', 'return']}
      isActive={parentZone.selection === COLUMNS.MAIN}
    >
      <Box flexDirection="column">
        <Box marginTop={-1}>
          <Text bold> {title} </Text>
        </Box>
        <Loader loading={loadingENS}>
          {resolvedAddress && <Text>Address: {resolvedAddress}</Text>}
        </Loader>
        <Selection<InputBoxProps> activeProps={{ focus: true }}>
          <InputBox
            label="Receiver"
            error={errors.receiver}
            {...register('receiver')}
          />
        </Selection>
        <Text>
          <Text bold>Balance:</Text>{' '}
          <Loader loading={balanceIsLoading}>{formattedBalance}</Loader>{' '}
        </Text>
        <Selection<InputBoxProps> activeProps={{ focus: true }}>
          <InputBox
            type="number"
            label="Amount"
            error={errors.amount}
            loading={balanceIsLoading}
            {...register('amount')}
          />
        </Selection>
        <Selection<SelectionZoneProps> activeProps={{ isActive: true }}>
          <SelectionZone
            prevKey="leftArrow"
            nextKey="rightArrow"
            defaultSelection={1}
          >
            <Box justifyContent="space-around">
              <Selection<ButtonProps> activeProps={{ isFocused: true }}>
                <Button onPress={onBack} minWidth="20%" paddingX={1}>
                  <Text>{'<-'} Back</Text>
                </Button>
              </Selection>
              <Selection<ButtonProps> activeProps={{ isFocused: true }}>
                <Button
                  onPress={() => onTransfer(data)}
                  minWidth="20%"
                  paddingX={1}
                  isDisabled={!isValid || loadingENS}
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
