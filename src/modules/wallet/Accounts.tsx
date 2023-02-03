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
import { Account, COLUMNS, useWalletStore } from '@src/store'

export const Accounts: React.FC = () => {
  const parentZone = useSelectionZone()!
  const navigate = useNavigate()
  const accounts = useWalletStore((state) => state.accounts)
  const pathId = useWalletStore((state) => state.pathId)
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
          <Selection activeProps={{ isFocused: true }}>
            <Button onPress={() => navigate(ROUTE.ACCOUNTS_CREATE, {})}>
              Create account
            </Button>
          </Selection>
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
                      label={`${account.name} [${account.pathId}]`}
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
