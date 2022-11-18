import { Button } from '@components'
import { InputBox } from '@components/InputBox'
import {
  Selection,
  SelectionZone,
  useSelectionZone,
} from '@components/SelectionZone'
import { FormatTypes, Result } from '@ethersproject/abi'
import { BigNumber } from '@ethersproject/bignumber'
import {
  combine,
  isIntegerNumber,
  numberInRange,
  useGasLimit,
  useForm,
  useGasPrice,
  useChain,
} from '@hooks'
import { Divider } from '@src/components/Divider'
import { Loader } from '@src/components/Loader'
import { ROUTE, useData, useNavigate } from '@src/routes'
import { COLUMNS, useBlockchainStore } from '@src/store'
import { Box, Text } from 'ink'
import React, { useEffect, useState } from 'react'

enum Step {
  EDIT_TX,
  CONFIRM_TX,
  WAITING,
}

type Inputs = {
  gasPrice: string
  gasLimit: string
}

export const ConfirmTransaction: React.FC = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>(Step.EDIT_TX)
  const [txHash, setTxHash] = useState<string>()
  const chain = useChain()
  const parentZone = useSelectionZone()!

  const confirmData = useData<ROUTE.CONFIRM_TRANSACTION>()

  if (!confirmData) {
    throw new Error('Transaction not found')
  }

  const { populatedTx, target } = confirmData

  const [gasLimit, gasLimitLoading] = useGasLimit(populatedTx)
  const [gasPrice, gasPriceLoading] = useGasPrice()

  const sendTransaction = useBlockchainStore((state) => state.sendTransaction)
  const txInProgress = useBlockchainStore((state) => state.txInProgress)

  const { register, change, data, errors, isValid } = useForm<Inputs>({
    rules: {
      gasPrice: combine(isIntegerNumber(), numberInRange(1, Infinity)),
      gasLimit: combine(isIntegerNumber(), numberInRange(21000, Infinity)),
    },
    options: {
      validateAction: 'blur',
    },
  })

  const onSendTransaction = () => {
    if (isValid) {
      populatedTx.gasLimit = BigNumber.from(data.gasLimit)
      populatedTx.gasPrice = BigNumber.from(data.gasPrice)

      sendTransaction(populatedTx).then((txHash) => setTxHash(txHash))

      setStep(Step.WAITING)
    }
  }

  const onReject = () => {
    navigate(ROUTE.WALLET)
  }

  useEffect(() => {
    change('gasPrice', gasPrice, true)
  }, [gasPrice])

  useEffect(() => {
    change('gasLimit', gasLimit, true)
  }, [gasLimit])

  if (step === Step.EDIT_TX) {
    return (
      <SelectionZone
        prevKey="upArrow"
        nextKey={['downArrow', 'return']}
        isActive={parentZone.selection === COLUMNS.MAIN}
      >
        <Box flexDirection="column">
          <Box marginTop={-1}>
            <Text> Edit </Text>
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
                    onPress={() => isValid && setStep(Step.CONFIRM_TX)}
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
    let callInfo: {
      method: string
      keys: string[]
      params: Result
    } | null = null

    if (target) {
      const calldata = populatedTx.data!
      const sighash = calldata.slice(0, 10)
      const method = target.interface.getFunction(sighash)
      const signature = `${method.name}(${method.inputs
        .map((input) => input.format(FormatTypes.full))
        .join(', ')})`
      const params: Result = target.interface.decodeFunctionData(
        method,
        calldata,
      )
      const keys = Object.keys(params).filter((key) => isNaN(Number(key)))

      callInfo = {
        method: signature,
        keys,
        params,
      }
    }

    return (
      <Box flexDirection="column">
        <Box marginTop={-1}>
          <Text> Confirm </Text>
        </Box>

        {callInfo ? (
          <>
            <Text>Call {callInfo.method} with params:</Text>
            <Box
              flexDirection="column"
              borderStyle="single"
              borderColor="green"
              marginY={1}
            >
              <Box marginTop={-1}>
                <Text bold> {callInfo.method} </Text>
              </Box>
              {callInfo.keys.map((key) => {
                const value = callInfo!.params[key]

                return (
                  <Text key={key}>
                    <Text bold>{key}:</Text> {value.toString()}
                  </Text>
                )
              })}
            </Box>
          </>
        ) : (
          <Text>
            Send {(populatedTx.value ?? BigNumber.from(0)).toString()}{' '}
            {chain.currency} to {populatedTx.to}
          </Text>
        )}

        <Text>Gas price: {data.gasPrice}</Text>
        <Text>Gas limit: {data.gasLimit}</Text>

        <Divider />

        <SelectionZone
          prevKey="leftArrow"
          nextKey="rightArrow"
          isActive={parentZone.selection === COLUMNS.MAIN}
          defaultSelection={2}
        >
          <Box justifyContent="space-around">
            <Selection activeProps={{ isFocused: true }}>
              <Button onPress={onReject} minWidth="20%" paddingX={1}>
                Reject
              </Button>
            </Selection>
            <Selection activeProps={{ isFocused: true }}>
              <Button
                onPress={() => setStep(Step.EDIT_TX)}
                minWidth="20%"
                paddingX={1}
              >
                Edit
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
      <Loader loading={txInProgress}>
        <Box flexDirection="column">
          <Text>Success</Text>
          <Text>Tx hash:</Text>
          <Text>{txHash}</Text>
        </Box>
      </Loader>
    )
  }

  return null
}
