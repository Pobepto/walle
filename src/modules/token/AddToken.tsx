import React from 'react'
import { Box, Text } from 'ink'
import { Button, Input } from '../../components'
import { isAddress, lengthRule, useForm, useSelection } from '../../hooks'
import { ROUTE, useNavigate } from '../../routes'
import { InputBox } from '../../components/InputBox'
import { COLUMNS, useAppStore } from '../../store'

type Inputs = {
  name: string
  symbol: string
  address: string
}

export const AddToken: React.FC = () => {
  const navigate = useNavigate()
  const activeColumn = useAppStore((state) => state.activeColumn)
  const { errors, register, validateAll } = useForm<Inputs>({
    rules: {
      name: lengthRule(3),
      symbol: lengthRule(3),
      address: isAddress(),
    },
    options: {
      validateAction: 'never',
    },
  })

  const [selection, setSelection, prevent] = useSelection(
    4,
    'upArrow',
    ['downArrow', 'return'],
    activeColumn === COLUMNS.MAIN,
    false,
  )

  const onApply = () => {
    const [isValid] = validateAll()

    if (isValid) {
      // TODO: save token to store
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
        label="Address"
        error={errors.address}
        focus={selection === 2}
        {...register('address')}
      />

      <Button isFocused={selection === 3} onPress={onApply}>
        Add token
      </Button>
    </Box>
  )
}
