import React, { useEffect, useState } from 'react'
import { Box, Text } from 'ink'

import { Button, ButtonProps, Error } from '@components'
import { InputBox, InputBoxProps } from '@components/InputBox'
import {
  Selection,
  SelectionZone,
  SelectionZoneProps,
  useSelectionZone,
} from '@components/SelectionZone'
import { TransactionDetails } from '@components/TransactionDetails'
import { BigNumber } from '@ethersproject/bignumber'
import { PopulatedTransaction } from '@ethersproject/contracts'
import { formatUnits, parseUnits } from '@ethersproject/units'
import {
  combine,
  isIntegerNumber,
  isNumber,
  numberInRange,
  useChain,
  useEstimate,
  useForm,
  useGasData,
} from '@hooks'
import { Divider } from '@src/components/Divider'
import { Loader } from '@src/components/Loader'
import { TextButton, TextButtonProps } from '@src/components/TextButton'
import { GasPriceUnit } from '@src/constants'
import { ROUTE, useNavigate, useRouteData } from '@src/routes'
import { COLUMNS, useBlockchainStore } from '@src/store'

type Inputs = {
  gasPrice: string
  maxFeePerGas: string
  maxPriorityFeePerGas: string
  gasLimit: string
}

enum DisplayMode {
  PARSED,
  RAW,
}

const formatGasPrice = (gasPrice: BigNumber) => {
  return formatUnits(gasPrice, GasPriceUnit).toString()
}

export const ConfirmTransaction: React.FC = () => {
  const parentZone = useSelectionZone()!
  const navigate = useNavigate()
  const [isSending, setSending] = useState(false)
  const [displayMode, setDisplayMode] = useState<DisplayMode>(
    DisplayMode.PARSED,
  )
  const chain = useChain()
  const sendTransaction = useBlockchainStore((state) => state.sendTransaction)
  const { populatedTx, target, onRejectTx, onApproveTx } =
    useRouteData<ROUTE.CONFIRM_TRANSACTION>()

  const estimate = useEstimate(populatedTx)
  const gas = useGasData(populatedTx)

  const { register, change, data, errors, isValid } = useForm<Inputs>({
    rules: {
      gasPrice: isNumber(),
      gasLimit: combine(isIntegerNumber(), numberInRange(21000, Infinity)),
    },
    validateAction: 'blur',
  })

  const isEIP1599 =
    !populatedTx.gasPrice &&
    (populatedTx.maxFeePerGas || gas.data.maxFeePerGas.gt(0))

  const onSendTransaction = async () => {
    let tx: PopulatedTransaction = {
      ...populatedTx,
      gasLimit: BigNumber.from(data.gasLimit),
    }

    if (isEIP1599) {
      delete tx.gasPrice
      tx = {
        ...tx,
        type: 2,
        maxFeePerGas: parseUnits(data.maxFeePerGas, GasPriceUnit),
        maxPriorityFeePerGas: parseUnits(
          data.maxPriorityFeePerGas,
          GasPriceUnit,
        ),
      }
    } else {
      delete tx.maxFeePerGas
      delete tx.maxPriorityFeePerGas
      tx = {
        ...tx,
        type: 0,
        gasPrice: parseUnits(data.gasPrice, GasPriceUnit),
      }
    }

    try {
      setSending(true)
      const receipt = await sendTransaction(tx)

      if (receipt) {
        onApproveTx && onApproveTx(receipt.transactionHash)
        navigate(ROUTE.STATUS_TRANSACTION, { receipt })
      }
    } catch (error) {
      navigate(ROUTE.STATUS_TRANSACTION, { error: error?.toString() })
    }
  }

  const onReject = () => {
    navigate(ROUTE.HOME)
    onRejectTx && onRejectTx()
  }

  const onEstimate = () => estimate.call()
  const onUpdateGas = () => gas.call()

  useEffect(() => {
    const { gasPrice, maxFeePerGas, maxPriorityFeePerGas } = gas.data

    if (gasPrice.gt(0)) {
      change('gasPrice', formatGasPrice(gasPrice), true)
    }

    if (maxFeePerGas.gt(0)) {
      change('maxFeePerGas', formatGasPrice(maxFeePerGas), true)
    }

    if (maxPriorityFeePerGas.gt(0)) {
      change('maxPriorityFeePerGas', formatGasPrice(maxPriorityFeePerGas), true)
    }
  }, [gas.data])

  useEffect(() => {
    if (estimate.gasLimit.gt(0)) {
      change('gasLimit', estimate.gasLimit.toString(), true)
    }
  }, [estimate.gasLimit])

  const gasFee = BigNumber.from(
    parseUnits(data.gasPrice || '0', GasPriceUnit),
  ).mul(data.gasLimit || '0')

  const total = gasFee.add(populatedTx.value ?? '0')

  return (
    <Box flexDirection="column">
      <Box marginTop={-1}>
        <Text bold> Confirm </Text>
      </Box>
      <SelectionZone
        prevKey="upArrow"
        nextKey={['downArrow', 'return']}
        isActive={parentZone.selection === COLUMNS.MAIN}
      >
        <Selection activeProps={{ isFocused: true }}>
          <TransactionDetails
            contract={target}
            tx={populatedTx}
            displayMode={displayMode}
          />
        </Selection>

        <Selection<SelectionZoneProps> activeProps={{ isActive: true }}>
          <SelectionZone prevKey="leftArrow" nextKey="rightArrow">
            <Box justifyContent="space-around">
              <Selection<TextButtonProps> activeProps={{ isFocused: true }}>
                <TextButton
                  onPress={() => setDisplayMode(DisplayMode.PARSED)}
                  underline={displayMode === DisplayMode.PARSED}
                  autoPress
                >
                  Parsed
                </TextButton>
              </Selection>
              <Selection<TextButtonProps> activeProps={{ isFocused: true }}>
                <TextButton
                  onPress={() => setDisplayMode(DisplayMode.RAW)}
                  underline={displayMode === DisplayMode.RAW}
                  autoPress
                >
                  Raw
                </TextButton>
              </Selection>
            </Box>
          </SelectionZone>
        </Selection>

        <Divider symbol="—" />

        {isEIP1599 ? (
          <>
            <Box>
              <Selection<InputBoxProps>
                activeProps={{ focus: true }}
                selectedByDefault
              >
                <InputBox
                  label="Max fee"
                  type="number"
                  error={errors.maxFeePerGas}
                  loading={gas.loading}
                  postfix={` ${GasPriceUnit}`}
                  width="50%"
                  {...register('maxFeePerGas')}
                />
              </Selection>
              {populatedTx.maxFeePerGas ? (
                <Box alignItems="center" marginLeft={2}>
                  <Text>
                    Suggested max fee{' '}
                    <Text bold>
                      {formatGasPrice(populatedTx.maxFeePerGas)} {GasPriceUnit}
                    </Text>
                  </Text>
                </Box>
              ) : null}
            </Box>
            <Box>
              <Selection<InputBoxProps> activeProps={{ focus: true }}>
                <InputBox
                  label="Priority fee"
                  type="number"
                  error={errors.maxPriorityFeePerGas}
                  loading={gas.loading}
                  postfix={` ${GasPriceUnit}`}
                  width="50%"
                  {...register('maxPriorityFeePerGas')}
                />
              </Selection>
              {populatedTx.maxPriorityFeePerGas ? (
                <Box alignItems="center" marginLeft={2}>
                  <Text>
                    Suggested priority fee{' '}
                    <Text bold>
                      {formatGasPrice(populatedTx.maxPriorityFeePerGas)}{' '}
                      {GasPriceUnit}
                    </Text>
                  </Text>
                </Box>
              ) : null}
            </Box>
          </>
        ) : (
          <Box>
            <Selection<InputBoxProps>
              activeProps={{ focus: true }}
              selectedByDefault
            >
              <InputBox
                label="Gas price"
                type="number"
                error={errors.gasPrice}
                loading={gas.loading}
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
                    {formatGasPrice(populatedTx.gasPrice)} {GasPriceUnit}
                  </Text>
                </Text>
              </Box>
            ) : null}
          </Box>
        )}

        <Box>
          <Selection<InputBoxProps> activeProps={{ focus: true }}>
            <InputBox
              label="Gas limit"
              type="number"
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
          <Loader loading={gas.loading || estimate.loading}>
            {formatUnits(gasFee)} {chain.currency}
          </Loader>
        </Text>
        <Text>
          Total:{' '}
          <Loader loading={gas.loading || estimate.loading}>
            {formatUnits(total)} {chain.currency}
          </Loader>
        </Text>

        <Divider symbol="—" />

        <Selection<SelectionZoneProps> activeProps={{ isActive: true }}>
          <SelectionZone
            prevKey="leftArrow"
            nextKey="rightArrow"
            defaultSelection={3}
          >
            <Box justifyContent="space-around">
              <Selection<ButtonProps> activeProps={{ isFocused: true }}>
                <Button onPress={onReject} minWidth="20%" paddingX={1}>
                  Reject
                </Button>
              </Selection>
              <Selection<ButtonProps> activeProps={{ isFocused: true }}>
                <Button onPress={onUpdateGas} minWidth="20%" paddingX={1}>
                  Update gas
                </Button>
              </Selection>
              <Selection<ButtonProps> activeProps={{ isFocused: true }}>
                <Button onPress={onEstimate} minWidth="20%" paddingX={1}>
                  Estimate
                </Button>
              </Selection>
              <Selection<ButtonProps> activeProps={{ isFocused: true }}>
                <Button
                  onPress={onSendTransaction}
                  isLoading={isSending}
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
