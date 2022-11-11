import { Button } from '@components'
import { InputBox } from '@components/InputBox'
import {
  Selection,
  SelectionZone,
  useSelectionZone,
} from '@components/SelectionZone'
import {
  combine,
  isNumber,
  numberInRange,
  useGasLimit,
  useForm,
  useGasPrice,
} from '@hooks'
import { ROUTE, useData, useNavigate } from '@src/routes'
import { COLUMNS, useBlockchainStore } from '@src/store'
import { Box, Text } from 'ink'
import React, { useEffect, useState } from 'react'

enum Step {
  SET_TX_DETAILS,
  SEND_TX,
}

type Inputs = {
  gasPrice: string
  gasLimit: string
}

export const ConfirmTransaction: React.FC = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>(Step.SET_TX_DETAILS)
  const parentZone = useSelectionZone()!

  // TODO: need to get type of transaction for additional details
  const populatedTx = useData<ROUTE.CONFIRM_TRANSACTION>()

  if (!populatedTx) {
    throw new Error('Transaction not found')
  }

  const [gasLimit, gasLimitLoading] = useGasLimit(populatedTx)
  const [gasPrice, gasPriceLoading] = useGasPrice()

  const sendTransaction = useBlockchainStore((state) => state.sendTransaction)

  const { register, change, data, errors, isValid } = useForm<Inputs>({
    rules: {
      gasPrice: combine(isNumber(), numberInRange(0, Infinity)),
      gasLimit: combine(isNumber(), numberInRange(0, Infinity)),
    },
    initialValues: {
      gasPrice: '0',
      gasLimit: '0',
    },
    options: {
      validateAction: 'blur',
    },
  })

  const onSendTransaction = () => {
    if (isValid) {
      sendTransaction(populatedTx)
    }
  }

  const onReject = () => {
    navigate(ROUTE.WALLET)
  }

  useEffect(() => {
    change('gasPrice', gasPrice)
  }, [gasPrice])

  useEffect(() => {
    change('gasLimit', gasLimit)
  }, [gasLimit])

  if (step === Step.SET_TX_DETAILS) {
    return (
      <SelectionZone
        nextKey="downArrow"
        prevKey="upArrow"
        isActive={parentZone.selection === COLUMNS.MAIN}
      >
        <Box flexDirection="column">
          <Box marginTop={-1}>
            <Text> Edit gas </Text>
          </Box>

          <Selection activeProps={{ focus: true }}>
            <InputBox
              label="Gas price"
              error={errors.gasPrice}
              disabled={gasPriceLoading}
              {...register('gasPrice')}
            />
          </Selection>
          <Selection activeProps={{ focus: true }}>
            <InputBox
              label="Gas limit"
              error={errors.gasLimit}
              disabled={gasLimitLoading}
              {...register('gasLimit')}
            />
          </Selection>

          <Box flexDirection="column">
            <Selection activeProps={{ isFocused: true }}>
              <Button onPress={onReject}>Reject</Button>
            </Selection>
            <Selection activeProps={{ isFocused: true }}>
              <Button
                onPress={() => setStep(Step.SEND_TX)}
                isLoading={gasLimitLoading || gasPriceLoading}
              >
                Next
              </Button>
            </Selection>
          </Box>
        </Box>
      </SelectionZone>
    )
  }

  return (
    <Box flexDirection="column">
      <Box marginTop={-1}>
        <Text> Confirm </Text>
      </Box>
      <Text>Gas price: {data.gasPrice}</Text>
      <Text>Gas limit: {data.gasLimit}</Text>

      <SelectionZone
        nextKey="downArrow"
        prevKey="upArrow"
        isActive={parentZone.selection === COLUMNS.MAIN}
      >
        <Box flexDirection="column">
          <Selection activeProps={{ isFocused: true }}>
            <Button onPress={onReject}>Reject</Button>
          </Selection>
          <Selection activeProps={{ isFocused: true }}>
            <Button onPress={onSendTransaction}>Send</Button>
          </Selection>
        </Box>
      </SelectionZone>
    </Box>
  )
}
