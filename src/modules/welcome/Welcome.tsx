import { Box, Text } from 'ink'

import React from 'react'
import { ROUTE, useNavigate } from '@routes'
import { isFileExist, USER_DATA } from '@utils'
import { TextButton } from '@src/components/TextButton'
import { version } from '../../../package.json'
import { WALLE_LOGO } from '@src/constants'

export const Welcome: React.FC = () => {
  const navigate = useNavigate()

  const onEnter = async () => {
    const isExist = await isFileExist(USER_DATA)
    const route = isExist ? ROUTE.LOGIN : ROUTE.REGISTRATION

    navigate(route)
  }

  return (
    <Box flexDirection="column" justifyContent="center" alignItems="center">
      <Box flexDirection="column" marginBottom={1}>
        <Text>{WALLE_LOGO}</Text>
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
