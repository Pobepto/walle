import React from 'react'
import { Box, Text } from 'ink'

import { Button, ButtonProps, Error } from '@src/components'
import { InputBox } from '@src/components/InputBox'
import {
  Selection,
  SelectionZone,
  useSelectionZone,
} from '@src/components/SelectionZone'
import { useWallet } from '@src/hooks'
import { ROUTE, useNavigate, useRouteData } from '@src/routes'
import { COLUMNS } from '@src/store'
import { toUtf8String } from '@src/utils'

export const SignMessage: React.FC = () => {
  const navigate = useNavigate()
  const wallet = useWallet()!
  const parentZone = useSelectionZone()!
  const { message, onReject, onSign, warning } =
    useRouteData<ROUTE.SIGN_MESSAGE>()

  const utfMessage = toUtf8String(message)

  const sign = async () => {
    navigate(ROUTE.HOME)
    const signedMessage = await wallet.signMessage(utfMessage)
    onSign(signedMessage)
  }

  return (
    <Box flexDirection="column">
      <Box marginTop={-1}>
        <Text> Sign message </Text>
      </Box>
      <Text>You are signing:</Text>
      <InputBox onChange={() => undefined} value={utfMessage} disabled />
      {warning && (
        <Box borderStyle="single" borderColor="red" alignItems="center">
          <Error text="Your funds may be at risk" />
        </Box>
      )}
      <SelectionZone
        prevKey="leftArrow"
        nextKey="rightArrow"
        isActive={parentZone.selection === COLUMNS.MAIN}
      >
        <Box justifyContent="space-around">
          <Selection<ButtonProps> activeProps={{ isFocused: true }}>
            <Button
              onPress={() => {
                navigate(ROUTE.HOME)
                onReject()
              }}
              minWidth="20%"
              paddingX={1}
            >
              Reject
            </Button>
          </Selection>
          <Selection<ButtonProps> activeProps={{ isFocused: true }}>
            <Button onPress={sign} minWidth="20%" paddingX={1}>
              Sign
            </Button>
          </Selection>
        </Box>
      </SelectionZone>
    </Box>
  )
}
