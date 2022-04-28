import React from 'react'
import { Box, Text } from 'ink'
import { Wallet } from '@ethersproject/wallet'
import { Menu } from '../../components/Menu'
import { useAccountStore } from '../../store'

export const Account: React.FC = () => {
  const phrase = useAccountStore(state => state.phrase)
  const generateWallet = useAccountStore(state => state.generateWallet)

  const wallet = phrase && Wallet.fromMnemonic(phrase)

  return (
    <Box>
      <Text>Account: {wallet?.address}</Text>
      <Menu
        items={[
          {
            title: 'Create account',
            onSelect: () => generateWallet()
          },
          {
            title: 'Import account',
            onSelect: () => console.log('import')
          }
        ]}
      />
    </Box>
  )
}
