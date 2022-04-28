import React from 'react'
import { Box, Text } from 'ink'
import { useWallet } from '../hooks/useWallet'

export const Header: React.FC = () => {
  const wallet = useWallet() // TODO: why wallet is not Nullable?

  return (
    <Box borderStyle="classic" borderColor="cyan">
      <Text>Account: {wallet?.address}</Text>
    </Box>
  )
}
