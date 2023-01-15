import React from 'react'
import { Box, Text } from 'ink'
import { useForm, useSelection } from '@hooks'
import { ROUTE, useNavigate } from '@routes'
import { InputBox } from '@components/InputBox'
import { useWalletStore } from '@store'
import {
  deserialize,
  isFileExist,
  load,
  USER_DATA,
  USER_SETTINGS,
} from '@utils'
import AsyncButton from '@components/AsyncButton'
import { TextButton } from '@src/components/TextButton'
import { useAsync } from '@src/hooks/useAsync'
import { initSignClient } from '@src/wallet-connect'
import { initSubscribers } from '@src/store/initSubscribers'

type Inputs = {
  password: string
}

export const Login: React.FC = () => {
  const navigate = useNavigate()
  const decryptWallet = useWalletStore((state) => state.decryptWallet)
  const { data, register } = useForm<Inputs>()

  const { selection, select } = useSelection({
    amount: 3,
    prevKey: 'upArrow',
    nextKey: ['downArrow', 'return'],
    isActive: true,
  })

  const { execute, isLoading, error } = useAsync(async () => {
    const encrypted = await load(USER_DATA)
    await decryptWallet(data.password, encrypted)

    const isExist = await isFileExist(USER_SETTINGS)
    if (isExist) {
      const store = await load(USER_SETTINGS)
      deserialize(JSON.parse(store))
    }

    initSubscribers()
    await initSignClient()

    navigate(ROUTE.WALLET)
  })

  const login = () => {
    return execute().catch(() => {
      select(0)
    })
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
        onPress={login}
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
