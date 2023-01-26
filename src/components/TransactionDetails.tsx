import React, { useState } from 'react'
import { Box, Text } from 'ink'

import { FormatTypes } from '@ethersproject/abi'
import { BigNumber } from '@ethersproject/bignumber'
import { Contract, PopulatedTransaction } from '@ethersproject/contracts'
import { formatUnits } from '@ethersproject/units'
import { useChain } from '@hooks'
import { TextButton } from '@src/components/TextButton'

interface TransactionDetailsProps {
  contract?: Contract
  tx: PopulatedTransaction
  displayMode: DisplayMode
  isFocused?: boolean
}

enum DisplayMode {
  PARSED,
  RAW,
}

export const TransactionDetails: React.FC<TransactionDetailsProps> = ({
  contract,
  tx,
  displayMode,
  isFocused,
}) => {
  const chain = useChain()
  const [showFullData, setShowFullData] = useState(false)

  const { data, value, to } = tx

  const renderRawTransaction = () => {
    const stringifiedTx = Object.fromEntries(
      Object.entries(tx).map(([key, value]) => {
        if (typeof value === 'object' && value.type === 'BigNumber') {
          return [key, BigNumber.from(value).toString()]
        }

        return [key, value?.toString() ?? value]
      }),
    )

    const stringified = JSON.stringify(stringifiedTx, null, 2)

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

  if (contract) {
    if (displayMode === DisplayMode.RAW) {
      return renderRawTransaction()
    }

    const calldata = data ?? '0x'
    const sighash = calldata.slice(0, 10)
    const fragment = contract.interface.getFunction(sighash)
    const signature = `${fragment.name}(${fragment.inputs
      .map((input) => input.format(FormatTypes.full))
      .join(', ')})`
    const params = contract.interface.decodeFunctionData(fragment, calldata)
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
          Send{' '}
          <Text bold>
            {formatUnits(value ?? '0').toString()} {chain.currency}
          </Text>
        </Text>
        <Text>
          to <Text bold>{to}</Text>
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
        <TextButton
          onPress={() => setShowFullData((v) => !v)}
          isFocused={isFocused}
        >
          {displayData.length < data.length
            ? '🔽 Show full data 🔽'
            : '🔼 Show less data 🔼'}
        </TextButton>
      </Box>
    </Box>
  )
}
