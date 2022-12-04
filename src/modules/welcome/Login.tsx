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
  const { data, errors, register } = useForm<Inputs>()
  const [isLoading, setLoading] = useState(false)

  const [selection, select, preventInput] = useSelection({
    amount: 3,
    prevKey: 'upArrow',
    nextKey: ['downArrow', 'return'],
    isActive: true,
  })

  const onApply = async () => {
    try {
      setLoading(true)
      const encrypted = await load(USER_DATA) // TODO: Maybe load it once? 🤔
      await decryptWallet(data.password || '', encrypted)
      navigate(ROUTE.WALLET)
    } catch (error) {
      console.log('Oh here we go again...', error)
      preventInput()
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
      {!isLoading && (
        <Box alignItems="center" justifyContent="center">
          <TextButton
            isFocused={selection === 2}
            onPress={() => console.log('WIP')}
            color={selection === 2 ? 'red' : undefined}
          >
            Forgot password?
          </TextButton>
        </Box>
      )}
    </Box>
  )
}
