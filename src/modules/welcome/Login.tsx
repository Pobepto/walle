import React from 'react'
import { Box, Text } from 'ink'
import { Button } from '../../components'
import { useForm, useSelection } from '../../hooks'
import { ROUTE, useNavigate } from '../../routes'
import { InputBox } from '../../components/InputBox'
import { useWalletStore } from '../../store'
import { load } from '../../utils'
import AsyncButton from '../../components/AsyncButton'

type Inputs = {
  password: string
}

export const Login: React.FC = () => {
  const navigate = useNavigate()
  const decryptWallet = useWalletStore((state) => state.decryptWallet)
  const { data, errors, register, validateAll } = useForm<Inputs>({
    options: {
      validateAction: 'never',
    },
  })

  const [selection, setSelection, prevent] = useSelection(
    2,
    'upArrow',
    ['downArrow', 'return'],
    true,
    false,
  )

  const onApply = async () => {
    const [isValid] = validateAll()

    if (isValid) {
      try {
        const encrypted = await load() // TODO: Maybe load it once? 🤔
        console.log(encrypted)
        await decryptWallet(data.password, encrypted)
        navigate(ROUTE.WALLET)
      } catch (error) {
        console.log('Oh here we go again...', error)
      }
    } else {
      prevent()
      // TODO: focus on first error
      setSelection(0)
    }
  }

  return (
    <Box flexDirection="column" width="30%">
      <Text>Nice to see you!</Text>
      <InputBox
        label="Password"
        mask="*"
        error={errors.password}
        focus={selection === 0}
        {...register('password')}
      />

      <AsyncButton
        isFocused={selection === 1}
        onPress={onApply}
        spinner="fingerDance"
      >
        Unlock
      </AsyncButton>
    </Box>
  )
}
