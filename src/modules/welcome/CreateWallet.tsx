import React, { useEffect } from 'react'
import { Box, Text } from 'ink'
import { useAccountStore } from '../../store'
import { useWallet } from '../../hooks/useWallet'

export const CreateWallet: React.FC = () => {
  const wallet = useWallet()
  const generateWallet = useAccountStore(state => state.generateWallet)

  useEffect(() => {
    generateWallet()
  }, [])

  return (
    <Box flexDirection="column">
      <Text>Your wallet: {wallet?.address}</Text>
    </Box>
  )
}
