import React from 'react'
import { Box, Text } from 'ink'
import { Button } from '@components'
import {
  combine,
  isAddress,
  isNumber,
  length,
  numberInRange,
  useForm,
} from '@hooks'
import { InputBox } from '@components/InputBox'
import { COLUMNS, useTokensStore } from '@store'
import {
  Selection,
  SelectionZone,
  useSelectionZone,
} from '@src/components/SelectionZone'

type Inputs = {
  name: string
  symbol: string
  decimals: string
  address: string
}

export const AddToken: React.FC = () => {
  const parentZone = useSelectionZone()!
  const addToken = useTokensStore((state) => state.addToken)
  const { errors, register, isValid, data } = useForm<Inputs>({
    rules: {
      name: length(3),
      symbol: length(3),
      decimals: combine(isNumber(), numberInRange(0, 18)),
      address: isAddress(),
    },
  })

  const onSubmit = () => {
    if (isValid) {
      addToken({
        name: data.name,
        symbol: data.symbol,
        decimals: Number(data.decimals),
        address: data.address,
      })
    }
  }

  return (
    <SelectionZone
      prevKey="upArrow"
      nextKey={['downArrow', 'return']}
      isActive={parentZone.selection === COLUMNS.MAIN}
    >
      <Box flexDirection="column">
        <Box marginTop={-1}>
          <Text> Add new token </Text>
        </Box>
        <Selection activeProps={{ focus: true }}>
          <InputBox
            label="Address"
            error={errors.address}
            {...register('address')}
          />
        </Selection>
        <Selection activeProps={{ focus: true }}>
          <InputBox label="Name" error={errors.name} {...register('name')} />
        </Selection>
        <Selection activeProps={{ focus: true }}>
          <InputBox
            label="Symbol"
            error={errors.symbol}
            {...register('symbol')}
          />
        </Selection>
        <Selection activeProps={{ focus: true }}>
          <InputBox
            label="Decimals"
            error={errors.decimals}
            {...register('decimals')}
          />
        </Selection>

        <Selection activeProps={{ isFocused: true }}>
          <Button onPress={onSubmit}>Add token</Button>
        </Selection>
      </Box>
    </SelectionZone>
  )
}
