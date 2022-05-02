import React, { useEffect } from 'react'
import { Box, Text } from 'ink'
import { useAccountStore } from '../../store'
import { useWallet } from '../../hooks/useWallet'
import { ROUTE, useNavigate } from '../../routes'
import { Button } from '../../components'

export const CreateWallet: React.FC = () => {
  const navigate = useNavigate()
  const wallet = useWallet()
  const generateWallet = useAccountStore(state => state.generateWallet)

  useEffect(() => {
    generateWallet()
  }, [])

  return (
    <Box flexDirection="column">
      <Text>Your wallet: {wallet?.address}</Text>
      <Button keyType="return" isFocused onPress={() => navigate(ROUTE.REGISTRATION_PASSWORD)}>
        Press &quot;Enter&quot; to continue...
      </Button>
    </Box>
  )
}
