import React from 'react'
import { Box, Text } from 'ink'
import { Button } from '@components'
import { InputBox, InputBoxProps } from '@components/InputBox'
import { COLUMNS, useWalletStore } from '@store'
import {
  Selection,
  SelectionZone,
  useSelectionZone,
} from '@src/components/SelectionZone'
import { length, useForm } from '@src/hooks'
import { ROUTE, useNavigate } from '@src/routes'
import { save, USER_DATA } from '@src/utils'
import { ButtonLink } from '@src/components/ButtonLink'

type Inputs = {
  oldPassword: string
  password: string
  repeatPassword: string
}

export const ChangePassword: React.FC = () => {
  const navigate = useNavigate()
  const parentZone = useSelectionZone()!
  const currentPassword = useWalletStore((store) => store.password)
  const encryptWallet = useWalletStore((store) => store.encryptWallet)

  const { data, errors, register, isValid } = useForm<Inputs>({
    rules: {
      oldPassword: (value) => {
        if (value !== currentPassword) {
          return 'Incorrect password'
        }
      },
      password: length(1),
      repeatPassword: (value, data) => {
        if (!data.password || value !== data.password) {
          return 'Passwords do not match'
        }
      },
    },
    options: {
      validateAction: 'blur',
    },
  })

  const onPasswordChange = async () => {
    try {
      const encrypted = await encryptWallet(data.password)
      await save(encrypted, USER_DATA)
      navigate(ROUTE.SECURITY)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <SelectionZone
      prevKey="upArrow"
      nextKey={['downArrow', 'return']}
      isActive={parentZone.selection === COLUMNS.MAIN}
    >
      <Box flexDirection="column">
        <Box marginTop={-1}>
          <Text> Private Key </Text>
        </Box>
        <Selection<InputBoxProps> activeProps={{ focus: true }}>
          <InputBox
            label="Old password"
            mask="*"
            error={errors.oldPassword}
            {...register('oldPassword')}
          />
        </Selection>
        <Selection<InputBoxProps> activeProps={{ focus: true }}>
          <InputBox
            label="New password"
            mask="*"
            error={errors.password}
            {...register('password')}
          />
        </Selection>
        <Selection<InputBoxProps> activeProps={{ focus: true }}>
          <InputBox
            label="Repeat password"
            mask="*"
            error={errors.repeatPassword}
            {...register('repeatPassword')}
          />
        </Selection>
        <Selection activeProps={{ isFocused: true }}>
          <Button onPress={onPasswordChange} isDisabled={!isValid}>
            Change
          </Button>
        </Selection>
        <Selection activeProps={{ isFocused: true }}>
          <ButtonLink to={ROUTE.SECURITY}>Back</ButtonLink>
        </Selection>
      </Box>
    </SelectionZone>
  )
}
