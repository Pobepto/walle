import { Box, Text } from 'ink'

import React from 'react'
import { ROUTE, useNavigate } from '@routes'
import { isFileExist, USER_DATA } from '@utils'
import { TextButton } from '@src/components/TextButton'
import { version } from '../../../package.json'

const WALLE_LOGO = `
 _ _ _ _____ __    __    _____ 
| | | |  _  |  |  |  |  |   __|
| | | |     |  |__|  |__|   __|
|_____|__|__|_____|_____|_____|
`

export const Welcome: React.FC = () => {
  const navigate = useNavigate()

  const onEnter = () => {
    isFileExist(USER_DATA).then((isExist) => {
      if (isExist) {
        navigate(ROUTE.LOGIN)
      } else {
        navigate(ROUTE.REGISTRATION)
      }
    })
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
