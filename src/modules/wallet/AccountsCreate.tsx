import React from 'react'
import { Box, Text } from 'ink'

import { Button } from '@src/components'
import { InputBox } from '@src/components/InputBox'
import {
  Selection,
  SelectionZone,
  useSelectionZone,
} from '@src/components/SelectionZone'
import { combine, length, numberInRange, useForm } from '@src/hooks'
import { ROUTE, useNavigate, useRouteData } from '@src/routes'
import { COLUMNS, useWalletStore, WalletType } from '@src/store'

type Inputs = {
  name: string
  pathId: string
}

export const AccountsCreate: React.FC = () => {
  const parentZone = useSelectionZone()!
  const navigate = useNavigate()
  const accounts = useWalletStore((state) => state.accounts)
  const walletType = useWalletStore((state) => state.type)
  const createAccount = useWalletStore((state) => state.createAccount)

  const { account } = useRouteData<ROUTE.ACCOUNTS_CREATE>()
  const isEdit = !!account

  const { errors, register, isValid, data } = useForm<Inputs>({
    initialValues: {
      name: account?.name ?? '',
      pathId: account?.pathId.toString() ?? '',
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
      pathId: combine(numberInRange(0, 2147483647), (pathId) => {
        if (!pathId) return

        if (
          !isEdit &&
          accounts.find((account) => account.pathId === Number(pathId))
        ) {
          return 'Account with this pathId already exists'
        }
      }),
    },
  })

  const onCreate = () => {
    createAccount(data.name, data.pathId ? Number(data.pathId) : undefined)
    navigate(ROUTE.ACCOUNTS)
  }

  const isSupportAccounts = walletType === WalletType.MNEMONIC

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

        {isSupportAccounts && !isEdit && (
          <Selection activeProps={{ focus: true }}>
            <InputBox
              label="pathId"
              type="number"
              placeholder="auto"
              error={errors.pathId}
              {...register('pathId')}
            />
          </Selection>
        )}

        <Selection activeProps={{ focus: true }}>
          <InputBox label="Name" error={errors.name} {...register('name')} />
        </Selection>

        <Selection activeProps={{ isFocused: true }}>
          <Button onPress={onCreate} isDisabled={!isValid}>
            {isEdit ? 'Save' : 'Create'}
          </Button>
        </Selection>
      </Box>
    </SelectionZone>
  )
}
