import React from 'react'
import { Box, Text } from 'ink'
import { useForm, useSelection } from '@hooks'
import { ROUTE, useNavigate } from '@routes'
import { InputBox } from '@components/InputBox'
import { useWalletStore } from '@store'
import { load, USER_DATA } from '@utils'
import AsyncButton from '@components/AsyncButton'

type Inputs = {
  password: string
}

export const Login: React.FC = () => {
  const navigate = useNavigate()
  const decryptWallet = useWalletStore((state) => state.decryptWallet)
  const { data, errors, register } = useForm<Inputs>()

  const [selection, setSelection, prevent] = useSelection({
    amount: 2,
    prevKey: 'upArrow',
    nextKey: ['downArrow', 'return'],
    isActive: true,
    looped: false,
  })

  const onApply = async () => {
    try {
      const encrypted = await load(USER_DATA) // TODO: Maybe load it once? 🤔
      await decryptWallet(data.password || '', encrypted)
      navigate(ROUTE.WALLET)
    } catch (error) {
      console.log('Oh here we go again...', error)
      prevent()
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
