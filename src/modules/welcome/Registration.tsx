import { Box, Text } from 'ink'

import React from 'react'
import { Button } from '../../components/Button'
import { useSelection } from '../../hooks/useSelection'
import { ROUTE, useNavigate } from '../../routes'

export const Registration: React.FC = () => {
  const navigate = useNavigate()
  const selection = useSelection(2, 'leftArrow', 'rightArrow')

  return (
    <Box flexDirection="column">
      <Text>First time?</Text>
      <Text>Use {'<'}- or -{'>'} arrows to choose action</Text>
      <Box>
        <Button
          keyType="return"
          isFocused={selection === 0}
          onPress={() => navigate(ROUTE.REGISTRATION_IMPORT)}
        >
          Import wallet
        </Button>
        <Button
          keyType="return"
          isFocused={selection === 1}
          onPress={() => navigate(ROUTE.REGISTRATION_CREATE)}
        >
          Create wallet
        </Button>
      </Box>
    </Box>
  )
}
