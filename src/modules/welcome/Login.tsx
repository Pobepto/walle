import React, { useState } from 'react'
import { Box, Text } from 'ink'
import { useForm, useSelection } from '@hooks'
import { ROUTE, useNavigate } from '@routes'
import { InputBox } from '@components/InputBox'
import { useWalletStore } from '@store'
import { load, USER_DATA } from '@utils'
import AsyncButton from '@components/AsyncButton'
import { Button } from '@src/components'

type Inputs = {
  password: string
}

export const Login: React.FC = () => {
  const navigate = useNavigate()
  const decryptWallet = useWalletStore((state) => state.decryptWallet)
  const { data, errors, register } = useForm<Inputs>()
  const [isLoading, setLoading] = useState(false)

  const [selection, setSelection, prevent] = useSelection({
    amount: 3,
    prevKey: 'upArrow',
    nextKey: ['downArrow', 'return'],
    isActive: true,
    looped: false,
  })

  const onApply = async () => {
    try {
      setLoading(true)
      const encrypted = await load(USER_DATA) // TODO: Maybe load it once? 🤔
      await decryptWallet(data.password || '', encrypted)
      navigate(ROUTE.WALLET)
    } catch (error) {
      console.log('Oh here we go again...', error)
      prevent()
      setSelection(0)
    } finally {
      setLoading(false)
    }
  }

  const monkey = data.password?.length > 0 ? '🙈' : '🐵'

  return (
    <Box flexDirection="column" width="50%">
      <Box justifyContent="center" marginBottom={1}>
        <Text>{monkey}</Text>
      </Box>
      <InputBox
        label="Password"
        mask="*"
        error={errors.password}
        focus={selection === 0}
        {...register('password')}
      />
      <Box flexDirection="row" justifyContent="space-between">
        <AsyncButton
          isFocused={selection === 1}
          onPress={onApply}
          spinner="fingerDance"
          minWidth={isLoading ? '100%' : '40%'}
        >
          Unlock
        </AsyncButton>
        {!isLoading && (
          <Button
            isFocused={selection === 2}
            onPress={() => console.log('reset')}
            minWidth="40%"
          >
            Reset
          </Button>
        )}
      </Box>
    </Box>
  )
}
