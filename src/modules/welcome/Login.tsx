import React, { useState } from 'react'
import { Box, Text } from 'ink'
import { useForm, useSelection } from '@hooks'
import { ROUTE, useNavigate } from '@routes'
import { InputBox } from '@components/InputBox'
import { useWalletStore } from '@store'
import { load, USER_DATA } from '@utils'
import AsyncButton from '@components/AsyncButton'
import { TextButton } from '@src/components/TextButton'

type Inputs = {
  password: string
}

export const Login: React.FC = () => {
  const navigate = useNavigate()
  const decryptWallet = useWalletStore((state) => state.decryptWallet)
  const { data, register } = useForm<Inputs>()

  const [error, setError] = useState('')
  const [isLoading, setLoading] = useState(false)

  const [selection, select] = useSelection({
    amount: 3,
    prevKey: 'upArrow',
    nextKey: ['downArrow', 'return'],
    isActive: true,
  })

  const onApply = async () => {
    try {
      setLoading(true)
      setError('')
      const encrypted = await load(USER_DATA)
      await decryptWallet(data.password, encrypted)
      navigate(ROUTE.WALLET)
    } catch (err: unknown) {
      setError(err?.toString() ?? '')
      select(0)
    } finally {
      setLoading(false)
    }
  }

  const bear = data.password?.length > 0 ? '┬┴┬┴┬┴┬┴┬┴┬┴┬┴' : '┬┴┬┴┤ʕ•ᴥ├┬┴┬┴'

  return (
    <Box flexDirection="column" width="50%">
      <Box justifyContent="center" marginBottom={1}>
        <Text>{bear}</Text>
      </Box>
      <InputBox
        label="Password"
        mask="*"
        error={error}
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
      {!isLoading && (
        <Box alignItems="center" justifyContent="center">
          <TextButton
            isFocused={selection === 2}
            onPress={() => navigate(ROUTE.FORGOT_PASSWORD)}
            color={selection === 2 ? 'red' : undefined}
          >
            Forgot password?
          </TextButton>
        </Box>
      )}
    </Box>
  )
}
