import { Button } from '@components'
import { InputBox } from '@components/InputBox'
import {
  Selection,
  SelectionZone,
  useSelectionZone,
} from '@components/SelectionZone'
import { BigNumber } from '@ethersproject/bignumber'
import {
  combine,
  isNumber,
  numberInRange,
  useGasLimit,
  useForm,
  useGasPrice,
} from '@hooks'
import { Loader } from '@src/components/Loader'
import { ROUTE, useData, useNavigate } from '@src/routes'
import { COLUMNS, useBlockchainStore } from '@src/store'
import { Box, Text } from 'ink'
import React, { useEffect, useState } from 'react'

enum Step {
  SET_TX_DETAILS,
  CONFIRM_TX,
  WAITING,
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
  const txInProgress = useBlockchainStore((state) => state.txInProgress)

  const { register, change, data, errors, isValid } = useForm<Inputs>({
    rules: {
      gasPrice: combine(isNumber(), numberInRange(0, Infinity)),
      gasLimit: combine(isNumber(), numberInRange(0, Infinity)),
    },
    options: {
      validateAction: 'blur',
    },
  })

  const onSendTransaction = () => {
    if (isValid) {
      populatedTx.gasLimit = BigNumber.from(data.gasLimit)
      populatedTx.gasPrice = BigNumber.from(data.gasPrice)

      sendTransaction(populatedTx)

      setStep(Step.WAITING)
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
        prevKey="upArrow"
        nextKey={['downArrow', 'return']}
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
              loading={gasPriceLoading}
              {...register('gasPrice')}
            />
          </Selection>
          <Selection activeProps={{ focus: true }}>
            <InputBox
              label="Gas limit"
              error={errors.gasLimit}
              loading={gasLimitLoading}
              {...register('gasLimit')}
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
                  <Button onPress={onReject} minWidth="20%" paddingX={1}>
                    Reject
                  </Button>
                </Selection>
                <Selection activeProps={{ isFocused: true }}>
                  <Button
                    onPress={() => setStep(Step.CONFIRM_TX)}
                    minWidth="20%"
                    paddingX={1}
                    isLoading={gasLimitLoading || gasPriceLoading}
                  >
                    <Text>Next {'->'}</Text>
                  </Button>
                </Selection>
              </Box>
            </SelectionZone>
          </Selection>
        </Box>
      </SelectionZone>
    )
  }

  if (step === Step.CONFIRM_TX) {
    return (
      <Box flexDirection="column">
        <Box marginTop={-1}>
          <Text> Confirm </Text>
        </Box>
        <Text>Gas price: {data.gasPrice}</Text>
        <Text>Gas limit: {data.gasLimit}</Text>

        <SelectionZone
          prevKey="leftArrow"
          nextKey="rightArrow"
          isActive={parentZone.selection === COLUMNS.MAIN}
          defaultSelection={1}
        >
          <Box justifyContent="space-around">
            <Selection activeProps={{ isFocused: true }}>
              <Button onPress={onReject} minWidth="20%" paddingX={1}>
                Reject
              </Button>
            </Selection>
            <Selection activeProps={{ isFocused: true }}>
              <Button onPress={onSendTransaction} minWidth="20%" paddingX={1}>
                Send
              </Button>
            </Selection>
          </Box>
        </SelectionZone>
      </Box>
    )
  }

  if (step === Step.WAITING) {
    return (
      <Text>
        <Loader loading={txInProgress}>
          <Text>Success</Text>
        </Loader>
      </Text>
    )
  }

  return null
}
