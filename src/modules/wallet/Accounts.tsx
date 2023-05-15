import React from 'react'
import { Box, Text } from 'ink'

import { Button } from '@src/components'
import { ActionItem, ItemAction } from '@src/components/ActionItem'
import { List } from '@src/components/List'
import {
  Selection,
  SelectionZone,
  useSelectionZone,
} from '@src/components/SelectionZone'
import { TextButtonProps } from '@src/components/TextButton'
import { COLUMNS } from '@src/constants'
import { ROUTE, useNavigate } from '@src/routes'
import { Account, useWalletStore, WalletType } from '@src/store'

export const Accounts: React.FC = () => {
  const parentZone = useSelectionZone()!
  const navigate = useNavigate()
  const accounts = useWalletStore((state) => state.accounts)
  const accountIndex = useWalletStore((state) => state.accountIndex)
  const addressIndex = useWalletStore((state) => state.addressIndex)
  const walletType = useWalletStore((state) => state.type)
  const selectAccount = useWalletStore((state) => state.selectAccount)
  const deleteAccount = useWalletStore((state) => state.deleteAccount)

  const getAccountActions = (account: Account): ItemAction[] => {
    const isNotActiveAccount =
      account.accountIndex !== accountIndex ||
      account.addressIndex !== addressIndex

    return [
      {
        label: 'Switch',
        isVisible: isNotActiveAccount,
        onAction: () =>
          selectAccount(account.accountIndex, account.addressIndex),
      },
      {
        label: 'Edit',
        isVisible: true,
        onAction: () =>
          navigate(ROUTE.ACCOUNTS_CREATE, {
            account,
          }),
      },
      {
        label: 'Delete',
        isVisible: accounts.length > 1 && isNotActiveAccount,
        onAction: () =>
          deleteAccount(account.accountIndex, account.addressIndex),
      },
    ]
  }

  const isSupportAccounts = walletType === WalletType.MNEMONIC

  return (
    <SelectionZone
      prevKey="upArrow"
      nextKey="downArrow"
      isActive={parentZone.selection === COLUMNS.MAIN}
    >
      {(selection) => (
        <Box flexDirection="column">
          <Box marginTop={-1}>
            <Text bold> Manage accounts </Text>
          </Box>
          {isSupportAccounts ? (
            <Selection activeProps={{ isFocused: true }}>
              <Button onPress={() => navigate(ROUTE.ACCOUNTS_CREATE, {})}>
                Create account
              </Button>
            </Selection>
          ) : (
            <Box borderStyle="single" borderColor="yellow">
              <Text>
                Wallet imported by private key has no support for create
                accounts
              </Text>
            </Box>
          )}
          <List viewport={5} selection={selection}>
            {accounts
              .sort(
                (a, b) =>
                  a.accountIndex - b.accountIndex ||
                  a.addressIndex - b.addressIndex,
              )
              .map((account) => {
                return (
                  <Selection<TextButtonProps>
                    activeProps={{ isFocused: true }}
                    key={`${account.accountIndex}|${account.addressIndex}`}
                  >
                    <ActionItem
                      label={
                        isSupportAccounts
                          ? `[${account.accountIndex}/${account.addressIndex}] ${account.name}`
                          : account.name
                      }
                      actions={getAccountActions(account)}
                    />
                  </Selection>
                )
              })}
          </List>
        </Box>
      )}
    </SelectionZone>
  )
}
