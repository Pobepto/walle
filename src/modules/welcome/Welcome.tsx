import React, { useEffect, useRef } from 'react'
import { Box, Text } from 'ink'

import { ROUTE, useNavigate } from '@routes'
import { TextButton } from '@src/components/TextButton'
import { WALLE_LOGO } from '@src/constants'
import { restoreAppState, useAppStore } from '@src/store'

import { version } from '../../../package.json'

export const Welcome: React.FC = () => {
  const navigate = useNavigate()
  const wallets = useAppStore((store) => store.wallets)
  const initPromise = useRef<Promise<void>>()

  const onEnter = async () => {
    await initPromise.current

    if (wallets.length) {
      navigate(ROUTE.WALLETS)
    } else {
      navigate(ROUTE.REGISTRATION)
    }
  }

  useEffect(() => {
    initPromise.current = restoreAppState()
  }, [])

  return (
    <Box flexDirection="column" justifyContent="center" alignItems="center">
      <Box flexDirection="column" marginBottom={1}>
        <Text color="yellowBright">{WALLE_LOGO}</Text>
        <Text>Walle - Non-Custodial CLI Wallet</Text>
      </Box>
      <TextButton selectKey="any" onPress={onEnter} isFocused>
        Press any key to continue...
      </TextButton>
      <Box marginTop={2}>
        <Text>Ver. {version}</Text>
      </Box>
    </Box>
  )
}
