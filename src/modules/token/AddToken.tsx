import React from 'react'
import { Box, Text } from 'ink'
import { Button, Input } from '@components'
import {
  isAddress,
  lengthRule,
  numberInRange,
  useForm,
  useSelection,
} from '@hooks'
import { ROUTE, useNavigate } from '@routes'
import { InputBox } from '@components/InputBox'
import { COLUMNS, useAppStore, useTokensStore } from '@store'

type Inputs = {
  name: string
  symbol: string
  decimals: string
  address: string
}

export const AddToken: React.FC = () => {
  const navigate = useNavigate()
  const activeColumn = useAppStore((state) => state.activeColumn)
  const addToken = useTokensStore((state) => state.addToken)
  const { errors, register, validateAll, data } = useForm<Inputs>({
    rules: {
      name: lengthRule(3),
      symbol: lengthRule(3),
      decimals: numberInRange(0, 18),
      address: isAddress(),
    },
    options: {
      validateAction: 'never',
    },
  })

  const [selection, setSelection, prevent] = useSelection(
    5,
    'upArrow',
    ['downArrow', 'return'],
    activeColumn === COLUMNS.MAIN,
    false,
  )

  const onSubmit = () => {
    const [isValid] = validateAll()

    if (isValid) {
      // TODO: save token to store based on chain id
      console.log('here')
      addToken({
        name: data.name,
        symbol: data.symbol,
        decimals: Number(data.decimals),
        address: data.address,
      })
    } else {
      prevent()
      // TODO: focus on first error
      setSelection(0)
    }
  }

  return (
    <Box flexDirection="column">
      <Box marginTop={-1}>
        <Text> Add new token </Text>
      </Box>
      <InputBox
        label="Name"
        error={errors.name}
        focus={selection === 0}
        {...register('name')}
      />
      <InputBox
        label="Symbol"
        error={errors.symbol}
        focus={selection === 1}
        {...register('symbol')}
      />
      <InputBox
        label="Decimals"
        error={errors.decimals}
        focus={selection === 2}
        {...register('decimals')}
      />
      <InputBox
        label="Address"
        error={errors.address}
        focus={selection === 3}
        {...register('address')}
      />

      <Button isFocused={selection === 4} onPress={onSubmit}>
        Add token
      </Button>
    </Box>
  )
}
