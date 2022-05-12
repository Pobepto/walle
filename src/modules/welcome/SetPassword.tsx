import React from 'react'
import { Box, Text } from 'ink'
import { Button, Input } from '../../components'
import { lengthRule, useForm } from '../../hooks/useForm'
import { useSelection } from '../../hooks/useSelection'
import { ROUTE, useNavigate } from '../../routes'

type Inputs = {
  password: string;
  repeatPassword: string;
}

export const SetPassword: React.FC = () => {
  const navigate = useNavigate()
  const { errors, register, validateAll } = useForm<Inputs>({
    rules: {
      password: lengthRule(6),
      repeatPassword: (value, data) => {
        if (!data.password || value !== data.password) {
          return 'Passwords do not match'
        }
      }
    },
    options: {
      validateAction: 'never'
    }
  })

  const [selection, setSelection, prevent] = useSelection(3, 'upArrow', ['downArrow', 'return'], true, false)

  const onApply = () => {
    const [isValid] = validateAll()

    if (isValid) {
      navigate(ROUTE.ACCOUNT)
    } else {
      prevent()
      // TODO: focus on first error
      setSelection(0)
    }
  }

  return (
    <Box flexDirection="column">
      <Text>Set password to protect your wallet</Text>
      <Box borderStyle="classic" flexDirection="column">
        <Text>New password: </Text>
        <Input {...register('password')} mask="*" focus={selection === 0} />
        <Text color="red">{errors.password}</Text>
      </Box>
      <Box borderStyle="classic" flexDirection="column">
        <Text>Confirm password: </Text>
        <Input {...register('repeatPassword')} mask="*" focus={selection === 1} />
        <Text color="red">{errors.repeatPassword}</Text>
      </Box>

      <Box justifyContent='center' borderStyle={selection === 2 ? 'bold' : 'single'}>
        <Button isFocused={selection === 2} onPress={onApply}>Apply</Button>
      </Box>
    </Box>
  )
}
