import React, { useState } from 'react'
import { Box, Text } from 'ink'
import { Wallet } from '@ethersproject/wallet'
import { Menu } from '../../components/Menu'
import { useAccountStore, useAppStore } from '../../store'
import TextInput from 'ink-text-input'

export const Account: React.FC = () => {
  const menuFocused = useAppStore(state => state.menuFocused)
  const phrase = useAccountStore(state => state.phrase)
  const generateWallet = useAccountStore(state => state.generateWallet)
  const importWallet = useAccountStore(state => state.importWallet)

  const [test, setTest] = useState('')

  const wallet = phrase && Wallet.fromMnemonic(phrase)

  return (
    <Box display="flex" flexDirection="column">
      <Box>
        <Text>Account: {wallet?.address}</Text>
      </Box>
      <Menu
        focused={!menuFocused}
        items={[
          {
            title: 'Create account',
            onSelect: () => generateWallet()
          },
          {
            title: 'Import account',
            onSelect: () => importWallet(test)
          }
        ]}
      />
      <Box borderColor="blue" borderStyle="bold">
        <TextInput value={test} onChange={setTest} focus={!menuFocused}/>
      </Box>
    </Box>
  )
}
