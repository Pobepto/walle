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
import { ROUTE, useNavigate } from '@src/routes'
import { Account, COLUMNS, useWalletStore, WalletType } from '@src/store'

export const Accounts: React.FC = () => {
  const parentZone = useSelectionZone()!
  const navigate = useNavigate()
  const accounts = useWalletStore((state) => state.accounts)
  const pathId = useWalletStore((state) => state.activePathId)
  const walletType = useWalletStore((state) => state.type)
  const selectAccount = useWalletStore((state) => state.selectAccount)
  const deleteAccount = useWalletStore((state) => state.deleteAccount)

  const getAccountActions = (account: Account): ItemAction[] => {
    return [
      {
        label: 'Switch',
        isVisible: account.pathId !== pathId,
        onAction: () => selectAccount(account.pathId),
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
        isVisible: accounts.length > 1 && account.pathId !== pathId,
        onAction: () => deleteAccount(account.pathId),
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
              .sort((a, b) => a.pathId - b.pathId)
              .map((account) => {
                return (
                  <Selection<TextButtonProps>
                    key={account.pathId}
                    activeProps={{ isFocused: true }}
                  >
                    <ActionItem
                      label={
                        isSupportAccounts
                          ? `${account.name} [${account.pathId}]`
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
