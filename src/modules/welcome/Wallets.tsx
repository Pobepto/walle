import React from 'react'
import { Box, Text } from 'ink'

import { Button, ButtonProps } from '@src/components'
import { List } from '@src/components/List'
import {
  Selection,
  SelectionZone,
  SelectionZoneProps,
} from '@src/components/SelectionZone'
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
    <Box
      flexDirection="column"
      width="50%"
      borderStyle="double"
      borderColor="cyan"
      paddingX={1}
    >
      <Box marginTop={-1}>
        <Text bold> Your wallets </Text>
      </Box>
      <SelectionZone prevKey="upArrow" nextKey="downArrow" isActive>
        {(selection) => (
          <Box flexDirection="column">
            <Box
              flexDirection="column"
              alignItems="center"
              borderStyle="single"
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

            <Box>
              <Selection<SelectionZoneProps> activeProps={{ isActive: true }}>
                <SelectionZone prevKey="leftArrow" nextKey="rightArrow">
                  <Selection<ButtonProps> activeProps={{ isFocused: true }}>
                    <Button
                      width="50%"
                      onPress={() => navigate(ROUTE.REGISTRATION_CREATE)}
                    >
                      Create new wallet
                    </Button>
                  </Selection>
                  <Selection<ButtonProps> activeProps={{ isFocused: true }}>
                    <Button
                      width="50%"
                      onPress={() => navigate(ROUTE.REGISTRATION_IMPORT)}
                    >
                      Import wallet
                    </Button>
                  </Selection>
                </SelectionZone>
              </Selection>
            </Box>
          </Box>
        )}
      </SelectionZone>
    </Box>
  )
}
