import React, { useEffect } from 'react'
import { Box, Text } from 'ink'

import { Link } from '@components/Link'
import { useWallet } from '@hooks'
import { ROUTE } from '@routes'
import { useWalletStore } from '@store'

export const CreateWallet: React.FC = () => {
  const wallet = useWallet()
  const generateWallet = useWalletStore((state) => state.generateWallet)

  useEffect(() => {
    generateWallet()
  }, [])

  return (
    <Box flexDirection="column">
      <Text>Your wallet: {wallet?.address}</Text>
      <Link to={ROUTE.REGISTRATION_PASSWORD} isFocused>
        Press &quot;Enter&quot; to continue...
      </Link>
    </Box>
  )
}
