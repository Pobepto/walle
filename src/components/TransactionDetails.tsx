import React, { useState } from 'react'
import { Contract, formatUnits, PopulatedTransaction } from 'ethers'
import { Box, Text } from 'ink'

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

  const { data, value = 0n, to } = tx

  if (displayMode === DisplayMode.RAW) {
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
    const calldata = data ?? '0x'
    const sighash = calldata.slice(0, 10)
    const fragment = contract.interface.getFunction(sighash)
    const signature = `${fragment!.name}(${fragment!.inputs
      .map((input) => input.format('full'))
      .join(', ')})`
    const params = contract.interface.decodeFunctionData(fragment!, calldata)
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
        {value.gt(0) ? (
          <Text>
            And send {formatUnits(value)} {chain.currency}
          </Text>
        ) : null}
      </Box>
    )
  }

  if (!data || data === '0x') {
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
            {formatUnits(value)} {chain.currency}
          </Text>
        </Text>
        <Text>
          to <Text bold>{to}</Text>
        </Text>
      </Box>
    )
  }

  const needSliceData = data.length > 256
  const displayData =
    showFullData || !needSliceData ? data : `${data.slice(0, 256)}...`

  return (
    <Box flexDirection="column">
      <Text>Call contract</Text>
      <Text bold>{to}</Text>

      <Box
        flexDirection="column"
        borderStyle="single"
        borderColor="green"
        paddingX={1}
      >
        <Box marginTop={-1}>
          <Text bold> Data </Text>
        </Box>
        <Text>{displayData}</Text>
      </Box>
      {value.gt(0) ? (
        <Text>
          And send {formatUnits(value)} {chain.currency}
        </Text>
      ) : null}
      {needSliceData ? (
        <Box justifyContent="center">
          <TextButton
            onPress={() => setShowFullData((v) => !v)}
            isFocused={isFocused}
          >
            {showFullData ? '🔼 Show less data 🔼' : '🔽 Show full data 🔽'}
          </TextButton>
        </Box>
      ) : null}
    </Box>
  )
}
