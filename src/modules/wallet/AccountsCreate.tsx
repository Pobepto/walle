import React from 'react'
import { Box, Text } from 'ink'

import { Button } from '@src/components'
import { InputBox } from '@src/components/InputBox'
import {
  Selection,
  SelectionZone,
  useSelectionZone,
} from '@src/components/SelectionZone'
import { COLUMNS } from '@src/constants'
import { combine, length, numberInRange, useForm } from '@src/hooks'
import { ROUTE, useNavigate, useRouteData } from '@src/routes'
import { useWalletStore, WalletType } from '@src/store'

export const AccountsCreate: React.FC = () => {
  const parentZone = useSelectionZone()!
  const navigate = useNavigate()
  const accounts = useWalletStore((state) => state.accounts)
  const walletType = useWalletStore((state) => state.type)
  const createAccount = useWalletStore((state) => state.createAccount)

  const { account } = useRouteData<ROUTE.ACCOUNTS_CREATE>()
  const isEdit = !!account

  const { errors, register, isValid, data } = useForm({
    initialValues: {
      name: account?.name ?? '',
      accountIndex: account?.accountIndex.toString() ?? '0',
      addressIndex: account?.addressIndex.toString() ?? '',
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
      accountIndex: numberInRange(0, 2147483647),
      addressIndex: combine(
        numberInRange(0, 2147483647),
        (addressIndex, data) => {
          if (!addressIndex) return

          if (
            !isEdit &&
            accounts.find(
              (account) =>
                account.accountIndex === Number(data.accountIndex) &&
                account.addressIndex === Number(addressIndex),
            )
          ) {
            return 'Account with this address index already exists'
          }
        },
      ),
    },
  })

  const onCreate = () => {
    createAccount(
      data.name,
      data.accountIndex ? Number(data.accountIndex) : undefined,
      data.addressIndex ? Number(data.addressIndex) : undefined,
    )
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
          <>
            <Selection activeProps={{ focus: true }}>
              <InputBox
                label="accountIndex"
                type="number"
                placeholder="auto"
                error={errors.accountIndex}
                {...register('accountIndex')}
              />
            </Selection>
            <Selection activeProps={{ focus: true }}>
              <InputBox
                label="addressIndex"
                type="number"
                placeholder="auto"
                error={errors.addressIndex}
                {...register('addressIndex')}
              />
            </Selection>
          </>
        )}

        <Selection activeProps={{ focus: true }} selectedByDefault>
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
