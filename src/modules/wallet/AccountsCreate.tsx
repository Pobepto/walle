import React from 'react'
import { Box, Text } from 'ink'

import { Button } from '@src/components'
import { InputBox } from '@src/components/InputBox'
import {
  Selection,
  SelectionZone,
  useSelectionZone,
} from '@src/components/SelectionZone'
import { combine, length, useForm } from '@src/hooks'
import { ROUTE, useNavigate, useRouteData } from '@src/routes'
import { COLUMNS, useWalletStore } from '@src/store'

type Inputs = {
  name: string
}

export const AccountsCreate: React.FC = () => {
  const parentZone = useSelectionZone()!
  const navigate = useNavigate()
  const accounts = useWalletStore((state) => state.accounts)
  const createAccount = useWalletStore((state) => state.createAccount)

  const { account } = useRouteData<ROUTE.ACCOUNTS_CREATE>() ?? {}
  const isEdit = !!account

  const { errors, register, isValid, data } = useForm<Inputs>({
    initialValues: {
      name: account?.name ?? '',
    },
    rules: {
      name: combine(length(1), (name) => {
        if (
          !isEdit &&
          accounts.find((account) => account.name.trim() === name.trim())
        ) {
          return 'Account with this name already exists'
        }
      }),
    },
  })

  const onCreate = () => {
    createAccount(data.name, account?.pathId)
    navigate(ROUTE.ACCOUNTS)
  }

  return (
    <SelectionZone
      prevKey="upArrow"
      nextKey={['downArrow', 'return']}
      isActive={parentZone.selection === COLUMNS.MAIN}
    >
      <Box flexDirection="column">
        <Box marginTop={-1}>
          <Text bold> {isEdit ? 'Edit' : 'Create'} account </Text>
        </Box>

        <Selection activeProps={{ focus: true }}>
          <InputBox label="Name" error={errors.name} {...register('name')} />
        </Selection>

        <Selection activeProps={{ isFocused: true }}>
          <Button onPress={onCreate} isDisabled={!isValid}>
            {isEdit ? 'Edit' : 'Create'}
          </Button>
        </Selection>
      </Box>
    </SelectionZone>
  )
}
