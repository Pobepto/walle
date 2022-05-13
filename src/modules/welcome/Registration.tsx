import { Box, Text } from 'ink'

import React from 'react'
import { Link } from '../../components/Link'
import { useSelection } from '../../hooks'
import { ROUTE } from '../../routes'

export const Registration: React.FC = () => {
  const [selection] = useSelection(2, 'leftArrow', 'rightArrow', true, false)

  return (
    <Box flexDirection="column" alignItems='center'>
      <Text>First time?</Text>
      <Text>Use {'<'}- or -{'>'} arrows to choose action</Text>
      <Box>
        <Box margin={1} borderStyle={selection === 0 ? 'bold' : 'single'} flexDirection='column' alignItems='center' width="33%">
          <Box flexGrow={1}>
            <Text>Нет, меня уже есть секретная фраза для восстановления</Text>
          </Box>
          <Link to={ROUTE.REGISTRATION_IMPORT} isFocused={selection === 0}>
            Import wallet
          </Link>
        </Box>
        <Box margin={1} borderStyle={selection === 1 ? 'bold' : 'single'} flexDirection='column' alignItems='center' width="33%">
          <Box flexGrow={1}>
            <Text>Да, давайте настроим!</Text>
          </Box>
          <Link to={ROUTE.REGISTRATION_CREATE} isFocused={selection === 1}>
            Create wallet
          </Link>
        </Box>
      </Box>
    </Box>
  )
}
