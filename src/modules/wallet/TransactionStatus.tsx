import React from 'react'
import { Box, Text } from 'ink'

import { formatUnits } from '@ethersproject/units'
import { Button, ButtonProps } from '@src/components'
import { Selection, SelectionZone } from '@src/components/SelectionZone'
import { useChain } from '@src/hooks'
import { ROUTE, useNavigate, useRouteData } from '@src/routes'

export const TransactionStatus: React.FC = () => {
  const navigate = useNavigate()
  const chain = useChain()
  const { receipt, error } = useRouteData<ROUTE.TRANSACTION_STATUS>()

  const handleContinue = () => {
    navigate(ROUTE.HOME)
  }

  const handleBack = () => {
    navigate.back()
  }

  if (error || !receipt) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        height="95%"
        justifyContent="space-between"
      >
        <Box display="flex" flexDirection="column" paddingX={2}>
          <Box display="flex" justifyContent="center" marginBottom={1}>
            <Text color="red">Failed</Text>
          </Box>
          <Text>{error}</Text>
        </Box>
        <SelectionZone isActive prevKey="leftArrow" nextKey="rightArrow">
          <Box justifyContent="center">
            <Selection<ButtonProps> activeProps={{ isFocused: true }}>
              <Button onPress={handleBack}>Back</Button>
            </Selection>
            <Selection<ButtonProps> activeProps={{ isFocused: true }}>
              <Button onPress={handleContinue}>Continue...</Button>
            </Selection>
          </Box>
        </SelectionZone>
      </Box>
    )
  }

  const txFee = receipt.effectiveGasPrice.mul(receipt.gasUsed)

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="95%"
      justifyContent="space-between"
    >
      <Box display="flex" flexDirection="column" paddingX={2}>
        <Box display="flex" justifyContent="center" marginBottom={1}>
          <Text color={receipt.status ? 'green' : 'red'}>
            {receipt.status ? 'Success' : 'Failed'}
          </Text>
        </Box>
        <Text>
          <Text bold>To:</Text> {receipt.to}
        </Text>
        <Text>
          <Text bold>Hash:</Text> {receipt.transactionHash}
        </Text>
        <Text>
          <Text bold>Block number:</Text> {receipt.blockNumber}
        </Text>
        <Text>
          <Text bold>Gas used:</Text> {receipt.gasUsed.toString()}
        </Text>
        <Text>
          <Text bold>Transaction fee:</Text> {formatUnits(txFee)}{' '}
          {chain.currency}
        </Text>
      </Box>
      <Button onPress={handleContinue} isFocused>
        Continue...
      </Button>
    </Box>
  )
}
