import React, { useState } from 'react'
import { Box } from 'ink'
import { Menu } from '../../components/Menu'
import { useAccountStore, useAppStore } from '../../store'
import TextInput from 'ink-text-input'

export const Account: React.FC = () => {
  const menuFocused = useAppStore(state => state.menuFocused)
  const generateWallet = useAccountStore(state => state.generateWallet)
  const importWallet = useAccountStore(state => state.importWallet)
  const deriveMnemonicAddress = useAccountStore(state => state.deriveMnemonicAddress)

  const [test, setTest] = useState('')

  return (
    <Box display="flex" flexDirection="column">
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
          },
          {
            title: 'Derive address',
            onSelect: () => deriveMnemonicAddress()
          }
        ]}
      />
      <Box borderColor="blue" borderStyle="bold">
        <TextInput value={test} onChange={setTest} focus={!menuFocused}/>
      </Box>
    </Box>
  )
}
