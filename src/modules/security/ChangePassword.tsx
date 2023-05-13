import React from 'react'
import { Box, Text } from 'ink'

import { Button } from '@components'
import { InputBox, InputBoxProps } from '@components/InputBox'
import { ButtonLink } from '@src/components/ButtonLink'
import {
  Selection,
  SelectionZone,
  useSelectionZone,
} from '@src/components/SelectionZone'
import { length, useForm } from '@src/hooks'
import { ROUTE, useNavigate } from '@src/routes'
import { COLUMNS, useWalletStore } from '@store'

export const ChangePassword: React.FC = () => {
  const navigate = useNavigate()
  const parentZone = useSelectionZone()!
  const encryptWallet = useWalletStore((store) => store.encryptWallet)

  const { data, errors, register, isValid } = useForm({
    initialValues: {
      password: '',
      repeatPassword: '',
    },
    rules: {
      password: length(1),
      repeatPassword: (value, data) => {
        if (!data.password || value !== data.password) {
          return 'Passwords do not match'
        }
      },
    },
    validateAction: 'blur',
  })

  const onPasswordChange = async () => {
    try {
      await encryptWallet(data.password)
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
          <Text bold> Change Password </Text>
        </Box>
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
