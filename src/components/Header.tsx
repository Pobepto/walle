import React from 'react'
import { Box, Text } from 'ink'
import { Wallet } from '@ethersproject/wallet'

import { useAccountStore } from '../store'

export const Header: React.FC = () => {
  const phrase = useAccountStore(state => state.phrase)
  const wallet = phrase && Wallet.fromMnemonic(phrase)

  return (
    <Box borderStyle="classic" borderColor="cyan">
      <Text>Account: {wallet?.address}</Text>
    </Box>
  )
}
