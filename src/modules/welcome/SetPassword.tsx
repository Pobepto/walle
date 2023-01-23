import React, { useEffect, useState } from 'react'
import { Box, Text } from 'ink'
import zxcvbn, { ZXCVBNResult } from 'zxcvbn'

import AsyncButton from '@components/AsyncButton'
import { InputBox } from '@components/InputBox'
import { length, useForm, useSelection } from '@hooks'
import { ROUTE, useNavigate } from '@routes'
import { initSubscribers } from '@src/store/initSubscribers'
import { initSignClient } from '@src/wallet-connect'
import { useWalletStore } from '@store'
import { save, USER_DATA } from '@utils'

type Inputs = {
  password: string
  repeatPassword: string
}

export const SetPassword: React.FC = () => {
  const navigate = useNavigate()
  const [passwordStrength, setPasswordStrength] = useState<ZXCVBNResult>()
  const encryptWallet = useWalletStore((state) => state.encryptWallet)
  const { data, errors, register, validate } = useForm<Inputs>({
    rules: {
      password: length(1),
      repeatPassword: (value, data) => {
        if (!data.password || value !== data.password) {
          return 'Passwords do not match'
        }
      },
    },
    options: {
      validateAction: 'never',
    },
  })

  const {
    selection,
    select,
    prevent: preventInput,
  } = useSelection({
    amount: 3,
    prevKey: 'upArrow',
    nextKey: ['downArrow', 'return'],
    isActive: true,
  })

  const onApply = async () => {
    const [isValid] = validate()

    if (isValid) {
      const encrypted = await encryptWallet(data.password)
      await save(encrypted, USER_DATA)
      initSubscribers()
      await initSignClient()
      navigate(ROUTE.HOME)
    } else {
      preventInput()
      // TODO: focus on first error
      select(0)
    }
  }

  useEffect(() => {
    if (data.password) {
      const res = zxcvbn(data.password)
      setPasswordStrength(res)
    }
  }, [data.password])

  return (
    <Box flexDirection="column">
      <Text>Set password to protect your wallet</Text>
      <InputBox
        label="New password"
        mask="*"
        error={errors.password}
        focus={selection === 0}
        {...register('password')}
      />
      {passwordStrength?.feedback.warning ? (
        <Text color="yellow">- {passwordStrength.feedback.warning}</Text>
      ) : null}
      {passwordStrength?.feedback.suggestions.map((suggestion) => {
        return (
          <Text color="red" key={suggestion}>
            - {suggestion}
          </Text>
        )
      })}
      <InputBox
        label="Confirm password"
        mask="*"
        error={errors.repeatPassword}
        focus={selection === 1}
        {...register('repeatPassword')}
      />

      <AsyncButton
        isFocused={selection === 2}
        onPress={onApply}
        spinner="fingerDance"
      >
        Apply
      </AsyncButton>
    </Box>
  )
}
