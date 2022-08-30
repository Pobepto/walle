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
  useEstimate,
  useForm,
  useGasPrice,
} from '@hooks'
import { ROUTE, useData, useNavigate } from '@src/routes'
import { COLUMNS, useBlockchainStore } from '@src/store'
import { Box, Text } from 'ink'
import React, { useState } from 'react'

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

  const estimatedGas = useEstimate(populatedTx)
  const gasPrice = useGasPrice()
  const sendTransaction = useBlockchainStore((state) => state.sendTransaction)

  // too late for form
  console.log('current', estimatedGas, gasPrice)

  const { register, data, errors, isValid } = useForm<Inputs>({
    rules: {
      gasPrice: combine(isNumber(), numberInRange(0, Infinity)),
      gasLimit: combine(isNumber(), numberInRange(0, Infinity)),
    },
    initialValues: {
      gasPrice,
      gasLimit: estimatedGas,
    },
    options: {
      validateAction: 'blur',
    },
  })

  const onSendTransaction = () => {
    if (isValid) {
      console.log('success')
    }
  }

  const onReject = () => {
    navigate(ROUTE.WALLET)
  }

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
              {...register('gasPrice')}
            />
          </Selection>
          <Selection activeProps={{ focus: true }}>
            <InputBox
              label="Gas limit"
              error={errors.gasLimit}
              {...register('gasLimit')}
            />
          </Selection>

          <Box flexDirection="column">
            <Selection activeProps={{ isFocused: true }}>
              <Button onPress={onReject}>Reject</Button>
            </Selection>
            <Selection activeProps={{ isFocused: true }}>
              <Button onPress={() => setStep(Step.SEND_TX)}>Next</Button>
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
      <Text>Gas price: {gasPrice}</Text>
      <Text>Gas limit: {estimatedGas}</Text>

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
