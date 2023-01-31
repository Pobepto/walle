import React, { useEffect } from 'react'
import { Box, Text } from 'ink'

import { Button } from '@components'
import { InputBox } from '@components/InputBox'
import {
  combine,
  isAddress,
  isIntegerNumber,
  length,
  numberInRange,
  useForm,
} from '@hooks'
import {
  Selection,
  SelectionZone,
  useSelectionZone,
} from '@src/components/SelectionZone'
import { useAsync } from '@src/hooks/useAsync'
import { COLUMNS, useBlockchainStore, useTokensStore } from '@store'

type Inputs = {
  name: string
  symbol: string
  decimals: string
  address: string
}

export const AddToken: React.FC = () => {
  const parentZone = useSelectionZone()!

  const addToken = useTokensStore((state) => state.addToken)
  const loadToken = useBlockchainStore((state) => state.loadToken)

  const { errors, register, change, inputIsValid, isValid, data } =
    useForm<Inputs>({
      rules: {
        address: isAddress(),
        name: length(1),
        symbol: length(1),
        decimals: combine(isIntegerNumber(), numberInRange(1, 18)),
      },
    })

  const onSubmit = () => {
    addToken({
      address: data.address,
      name: data.name,
      symbol: data.symbol,
      decimals: Number(data.decimals),
    })
  }

  const { execute, error, isLoading, clearError } = useAsync(loadToken)

  useEffect(() => {
    if (inputIsValid('address')) {
      execute(data.address)
        .then(({ name, symbol, decimals }) => {
          change('name', name, true)
          change('symbol', symbol, true)
          change('decimals', decimals.toString(), true)
        })
        .catch(() => null)
    } else {
      clearError()
    }
  }, [data.address])

  return (
    <SelectionZone
      prevKey="upArrow"
      nextKey={['downArrow', 'return']}
      isActive={parentZone.selection === COLUMNS.MAIN}
    >
      <Box flexDirection="column">
        <Box marginTop={-1}>
          <Text bold> Add new token </Text>
        </Box>

        <Selection activeProps={{ focus: true }}>
          <InputBox
            label="Address"
            error={error || errors.address}
            {...register('address')}
          />
        </Selection>
        <Selection activeProps={{ focus: true }}>
          <InputBox
            label="Name"
            error={errors.name}
            loading={isLoading}
            {...register('name')}
          />
        </Selection>
        <Selection activeProps={{ focus: true }}>
          <InputBox
            label="Symbol"
            error={errors.symbol}
            loading={isLoading}
            {...register('symbol')}
          />
        </Selection>
        <Selection activeProps={{ focus: true }}>
          <InputBox
            label="Decimals"
            type="number"
            error={errors.decimals}
            loading={isLoading}
            {...register('decimals')}
          />
        </Selection>

        <Selection activeProps={{ isFocused: true }}>
          <Button onPress={onSubmit} isDisabled={!isValid}>
            Add token
          </Button>
        </Selection>
      </Box>
    </SelectionZone>
  )
}
