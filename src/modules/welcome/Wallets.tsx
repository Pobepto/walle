import React from 'react'
import { Box, Text } from 'ink'

import { Button, ButtonProps } from '@src/components'
import { List } from '@src/components/List'
import { Selection, SelectionZone } from '@src/components/SelectionZone'
import { TextButton, TextButtonProps } from '@src/components/TextButton'
import { ROUTE, useNavigate } from '@src/routes'
import { useWalletStore } from '@src/store'

export const Wallets: React.FC = () => {
  const navigate = useNavigate()
  const wallets = useWalletStore((store) => store.wallets)

  const login = (wallet: string) => {
    navigate(ROUTE.LOGIN, { wallet })
  }

  return (
    <Box flexDirection="column" width="100%">
      <Text>Your wallets</Text>
      <SelectionZone prevKey="upArrow" nextKey="downArrow" isActive>
        {(selection) => (
          <Box flexDirection="column">
            <Box
              flexDirection="column"
              borderStyle="single"
              borderColor="cyan"
              width="50%"
            >
              <List viewport={5} selection={selection}>
                {wallets.map((wallet) => {
                  return (
                    <Selection<TextButtonProps>
                      activeProps={{ isFocused: true }}
                      key={wallet}
                    >
                      <TextButton onPress={() => login(wallet)}>
                        {wallet}
                      </TextButton>
                    </Selection>
                  )
                })}
              </List>
            </Box>

            <Selection<ButtonProps> activeProps={{ isFocused: true }}>
              <Button onPress={() => navigate(ROUTE.REGISTRATION_CREATE)}>
                Create new wallet
              </Button>
            </Selection>
            <Selection<ButtonProps> activeProps={{ isFocused: true }}>
              <Button onPress={() => navigate(ROUTE.REGISTRATION_IMPORT)}>
                Import wallet
              </Button>
            </Selection>
          </Box>
        )}
      </SelectionZone>
    </Box>
  )
}
