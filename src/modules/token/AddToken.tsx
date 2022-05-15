import React from 'react'
import { Box, Text } from 'ink'
import { Button, Input } from '../../components'
import { isAddress, lengthRule, useForm, useSelection } from '../../hooks'
import { ROUTE, useNavigate } from '../../routes'

type Inputs = {
  name: string
  symbol: string
  address: string
}

export const AddToken: React.FC = () => {
  const navigate = useNavigate()
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
    true,
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
      <Text>Add new token</Text>
      <Box borderStyle="classic" flexDirection="column">
        <Box>
          <Text>Name: </Text>
          <Input {...register('name')} focus={selection === 0} />
        </Box>
        <Text color="red">{errors.name}</Text>
      </Box>
      <Box borderStyle="classic" flexDirection="column">
        <Box>
          <Text>Symbol: </Text>
          <Input {...register('symbol')} focus={selection === 1} />
        </Box>
        <Text color="red">{errors.symbol}</Text>
      </Box>
      <Box borderStyle="classic" flexDirection="column">
        <Box>
          <Text>Address: </Text>
          <Input {...register('address')} focus={selection === 2} />
        </Box>
        <Text color="red">{errors.address}</Text>
      </Box>

      <Button isFocused={selection === 3} onPress={onApply}>
        Add token
      </Button>
    </Box>
  )
}
