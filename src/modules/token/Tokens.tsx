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
import { COLUMNS, Token } from '@src/constants'
import { useTokens } from '@src/hooks'
import { ROUTE, useNavigate } from '@src/routes'
import { useTokensStore } from '@src/store'

export const Tokens: React.FC = () => {
  const parentZone = useSelectionZone()!
  const navigate = useNavigate()
  const tokens = useTokens()
  const deleteToken = useTokensStore((store) => store.deleteToken)

  const getTokenActions = (token: Token): ItemAction[] => {
    return [
      {
        label: 'Edit',
        isVisible: true,
        onAction: () => navigate(ROUTE.TOKEN_ADD, { token }),
      },
      {
        label: 'Delete',
        isVisible: true,
        onAction: () => deleteToken(token.chainId, token.address),
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
            <Text bold> Manage tokens </Text>
          </Box>
          <Selection activeProps={{ isFocused: true }}>
            <Button onPress={() => navigate(ROUTE.TOKEN_ADD, {})}>
              Add new token
            </Button>
          </Selection>
          <List viewport={5} selection={selection}>
            {tokens.map((token) => {
              return (
                <Selection<TextButtonProps>
                  key={`${token.chainId}${token.address}`}
                  activeProps={{ isFocused: true }}
                >
                  <ActionItem
                    label={`${token.name} [${token.symbol}]`}
                    actions={getTokenActions(token)}
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
