import { Button, ButtonProps, Error } from '@components'
import { InputBox, InputBoxProps } from '@components/InputBox'
import {
  Selection,
  SelectionZone,
  SelectionZoneProps,
  useSelectionZone,
} from '@components/SelectionZone'
import { FormatTypes } from '@ethersproject/abi'
import { BigNumber } from '@ethersproject/bignumber'
import { formatUnits, parseUnits } from '@ethersproject/units'
import {
  combine,
  isIntegerNumber,
  numberInRange,
  useForm,
  useGasPrice,
  useChain,
  isNumber,
  useEstimate,
} from '@hooks'
import { Divider } from '@src/components/Divider'
import { Loader } from '@src/components/Loader'
import { TextButton, TextButtonProps } from '@src/components/TextButton'
import { GasPriceUnit } from '@src/constants'
import { ROUTE, useRouteData, useNavigate } from '@src/routes'
import { COLUMNS, useBlockchainStore } from '@src/store'
import { Box, Text } from 'ink'
import React, { useEffect, useState } from 'react'

enum Step {
  CONFIRM_TX,
  WAITING,
}

type Inputs = {
  gasPrice: string
  gasLimit: string
}

enum DisplayMode {
  PARSED,
  RAW,
}

export const ConfirmTransaction: React.FC = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>(Step.CONFIRM_TX)
  const [txHash, setTxHash] = useState<string>()
  const [displayMode, setDisplayMode] = useState<DisplayMode>(
    DisplayMode.PARSED,
  )
  const chain = useChain()
  const parentZone = useSelectionZone()!
  const { populatedTx, target, onRejectTx, onApproveTx } =
    useRouteData<ROUTE.CONFIRM_TRANSACTION>()

  const estimate = useEstimate(populatedTx)
  const [gasPrice, gasPriceLoading] = useGasPrice(populatedTx.gasPrice)

  const [showFullData, setShowFullData] = useState(false)

  const sendTransaction = useBlockchainStore((state) => state.sendTransaction)
  const txInProgress = useBlockchainStore((state) => state.txInProgress)

  const { register, change, data, errors, isValid } = useForm<Inputs>({
    rules: {
      gasPrice: combine(isNumber()),
      gasLimit: combine(isIntegerNumber(), numberInRange(21000, Infinity)),
    },
    options: {
      validateAction: 'blur',
    },
  })

  const onSendTransaction = async () => {
    populatedTx.gasLimit = BigNumber.from(data.gasLimit)
    populatedTx.gasPrice = parseUnits(data.gasPrice, GasPriceUnit)

    setStep(Step.WAITING)

    const receipt = await sendTransaction(populatedTx)

    if (receipt) {
      setTxHash(receipt.transactionHash)
      onApproveTx && onApproveTx(receipt.transactionHash)
    }
  }

  const onReject = () => {
    navigate(ROUTE.WALLET)
    onRejectTx && onRejectTx()
  }

  useEffect(() => {
    if (gasPrice) {
      change('gasPrice', formatUnits(gasPrice, GasPriceUnit).toString(), true)
    }
  }, [gasPrice])

  useEffect(() => {
    if (estimate.gasLimit) {
      change('gasLimit', estimate.gasLimit.toString(), true)
    }
  }, [estimate.gasLimit])

  const renderRawTransaction = () => {
    const tx = Object.fromEntries(
      Object.entries(populatedTx).map(([key, value]) => {
        if (typeof value === 'object' && value.type === 'BigNumber') {
          return [key, BigNumber.from(value).toString()]
        }

        return [key, value?.toString() ?? value]
      }),
    )

    const stringified = JSON.stringify(tx, null, 2)

    return (
      <Box
        flexDirection="column"
        borderStyle="single"
        borderColor="green"
        paddingX={1}
      >
        <Text>{stringified}</Text>
      </Box>
    )
  }

  const renderTransaction = () => {
    const { data, value, to } = populatedTx

    if (target) {
      if (displayMode === DisplayMode.RAW) {
        return renderRawTransaction()
      }

      const calldata = data ?? '0x'
      const sighash = calldata.slice(0, 10)
      const fragment = target.interface.getFunction(sighash)
      const signature = `${fragment.name}(${fragment.inputs
        .map((input) => input.format(FormatTypes.full))
        .join(', ')})`
      const params = target.interface.decodeFunctionData(fragment, calldata)
      const onlyStringArgs = Object.keys(params).filter((key) =>
        isNaN(Number(key)),
      )

      return (
        <Box flexDirection="column">
          <Box
            flexDirection="column"
            borderStyle="single"
            borderColor="green"
            paddingX={1}
          >
            <Box marginTop={-1}>
              <Text bold> {signature} </Text>
            </Box>
            {onlyStringArgs.map((arg) => {
              const value = params[arg]

              return (
                <Text key={arg}>
                  <Text bold>{arg}:</Text> {value.toString()}
                </Text>
              )
            })}
          </Box>
          {value && value.gt(0) ? (
            <Text>
              And send {formatUnits(value).toString()} {chain.currency}
            </Text>
          ) : null}
        </Box>
      )
    }

    if (!data || data === '0x') {
      if (displayMode === DisplayMode.RAW) {
        return renderRawTransaction()
      }

      return (
        <Box
          flexDirection="column"
          borderStyle="single"
          borderColor="green"
          paddingX={1}
        >
          <Box marginTop={-1}>
            <Text bold> Send {chain.currency} </Text>
          </Box>
          <Text>
            Send {formatUnits(value ?? '0').toString()} {chain.currency}
          </Text>
          <Text>
            To <Text bold>{to}</Text>
          </Text>
        </Box>
      )
    }

    const displayData = showFullData ? data : `${data.slice(0, 256)}...`

    return (
      <Box marginTop={1} flexDirection="column">
        <Text>Call contract</Text>
        <Text bold>{to}</Text>

        <Box marginTop={1}>
          <Text>with data:</Text>
        </Box>
        <Box borderStyle="single" borderColor="green" paddingX={1}>
          <Text>{displayData}</Text>
        </Box>
        <Box justifyContent="center" marginBottom={1}>
          <Selection<TextButtonProps> activeProps={{ isFocused: true }}>
            <TextButton onPress={() => setShowFullData((v) => !v)}>
              {displayData.length < data.length
                ? '🔽 Show full data 🔽'
                : '🔼 Show less data 🔼'}
            </TextButton>
          </Selection>
        </Box>
      </Box>
    )
  }

  if (step === Step.CONFIRM_TX) {
    const gasFee = BigNumber.from(
      parseUnits(data.gasPrice || '0', GasPriceUnit),
    ).mul(data.gasLimit || '0')
    const total = gasFee.add(populatedTx.value ?? '0')

    return (
      <Box flexDirection="column">
        <Box marginTop={-1}>
          <Text> Confirm </Text>
        </Box>
        <SelectionZone
          prevKey="upArrow"
          nextKey={['downArrow', 'return']}
          isActive={parentZone.selection === COLUMNS.MAIN}
        >
          {renderTransaction()}

          <Selection<SelectionZoneProps> activeProps={{ isActive: true }}>
            <SelectionZone prevKey="leftArrow" nextKey="rightArrow">
              <Box justifyContent="space-around">
                <Selection<TextButtonProps> activeProps={{ isFocused: true }}>
                  <TextButton
                    onPress={() => setDisplayMode(DisplayMode.PARSED)}
                    underline={displayMode === DisplayMode.PARSED}
                  >
                    Parsed
                  </TextButton>
                </Selection>
                <Selection<TextButtonProps> activeProps={{ isFocused: true }}>
                  <TextButton
                    onPress={() => setDisplayMode(DisplayMode.RAW)}
                    underline={displayMode === DisplayMode.RAW}
                  >
                    Raw
                  </TextButton>
                </Selection>
              </Box>
            </SelectionZone>
          </Selection>

          {/* {populatedTx.gasPrice ? (
            <Text>
              Suggested gas price{' '}
              {formatUnits(populatedTx.gasPrice, GasPriceUnit).toString()}
              {' '}{GasPriceUnit}
            </Text>
          ) : null} */}
          <Box>
            <Selection<InputBoxProps>
              activeProps={{ focus: true }}
              selectedByDefault
            >
              <InputBox
                label="Gas price"
                error={errors.gasPrice}
                loading={gasPriceLoading}
                postfix={` ${GasPriceUnit}`}
                width="50%"
                {...register('gasPrice')}
              />
            </Selection>
            {populatedTx.gasPrice ? (
              <Box alignItems="center" marginLeft={2}>
                <Text>
                  Suggested gas price{' '}
                  <Text bold>
                    {formatUnits(populatedTx.gasPrice, GasPriceUnit).toString()}{' '}
                    {GasPriceUnit}
                  </Text>
                </Text>
              </Box>
            ) : null}
          </Box>

          <Box>
            <Selection<InputBoxProps> activeProps={{ focus: true }}>
              <InputBox
                label="Gas limit"
                error={errors.gasLimit}
                loading={estimate.loading}
                width="50%"
                {...register('gasLimit')}
              />
            </Selection>
            {populatedTx.gasLimit ? (
              <Box alignItems="center" marginLeft={2}>
                <Text>
                  Suggested gas limit{' '}
                  <Text bold>
                    {BigNumber.from(populatedTx.gasLimit).toString()}
                  </Text>
                </Text>
              </Box>
            ) : null}
          </Box>

          {estimate.error ? (
            <Box justifyContent="center">
              <Error text={estimate.error} />
            </Box>
          ) : null}

          <Divider symbol="—" />

          <Text>
            Gas fee:{' '}
            <Loader loading={gasPriceLoading || estimate.loading}>
              {formatUnits(gasFee)} {chain.currency}
            </Loader>
          </Text>
          <Text>
            Total: {formatUnits(total)} {chain.currency}
          </Text>

          <Divider symbol="—" />

          <Selection<SelectionZoneProps> activeProps={{ isActive: true }}>
            <SelectionZone
              prevKey="leftArrow"
              nextKey="rightArrow"
              defaultSelection={2}
            >
              <Box justifyContent="space-around">
                <Selection<ButtonProps> activeProps={{ isFocused: true }}>
                  <Button onPress={onReject} minWidth="20%" paddingX={1}>
                    Reject
                  </Button>
                </Selection>
                <Selection<ButtonProps> activeProps={{ isFocused: true }}>
                  <Button
                    onPress={onSendTransaction}
                    isDisabled={!isValid}
                    minWidth="20%"
                    paddingX={1}
                  >
                    Send
                  </Button>
                </Selection>
              </Box>
            </SelectionZone>
          </Selection>
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
