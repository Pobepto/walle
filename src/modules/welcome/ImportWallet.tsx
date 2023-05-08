import React from 'react'
import { Box, Text } from 'ink'

import { Wallet } from '@ethersproject/wallet'
import { Button, ButtonProps } from '@src/components'
import { InputBox, InputBoxProps } from '@src/components/InputBox'
import { Selection, SelectionZone } from '@src/components/SelectionZone'
import { useForm } from '@src/hooks'
import { ROUTE, useNavigate } from '@src/routes'
import { useWalletStore, WalletType } from '@src/store'
import { getWalletType } from '@src/store/wallet/actions'

type Inputs = {
  mnemonicOrPrivateKey: string
}

export const ImportWallet: React.FC = () => {
  const navigate = useNavigate()
  const importWallet = useWalletStore((state) => state.importWallet)

  const { data, errors, isValid, register } = useForm<Inputs>({
    rules: {
      mnemonicOrPrivateKey: (value) => {
        try {
          new Wallet(value)
        } catch {
          try {
            Wallet.fromMnemonic(value)
          } catch {
            return 'Phrase or private key is invalid'
          }
        }
      },
    },
  })

  const walletType = getWalletType(data.mnemonicOrPrivateKey)

  const onImport = () => {
    importWallet(data.mnemonicOrPrivateKey)
    navigate(ROUTE.REGISTRATION_PASSWORD)
  }

  return (
    <Box
      flexDirection="column"
      width="100%"
      borderStyle="double"
      borderColor="cyan"
      paddingX={1}
    >
      <Box marginTop={-1}>
        <Text bold> Import </Text>
      </Box>
      <Box>
        <Text>Import wallet by mnemonic or private key:</Text>
      </Box>
      {walletType === WalletType.MNEMONIC && (
        <Box>
          <Text>Test 1</Text>
        </Box>
      )}
      {walletType === WalletType.PRIVATE_KEY && (
        <Box>
          <Text>Test 2</Text>
        </Box>
      )}
      <Box alignItems="center" flexDirection="column">
        <SelectionZone prevKey="upArrow" nextKey="downArrow" isActive>
          <Selection<InputBoxProps> activeProps={{ focus: true }}>
            <InputBox
              width="70%"
              error={errors.mnemonicOrPrivateKey}
              {...register('mnemonicOrPrivateKey')}
            />
          </Selection>
          <Selection<ButtonProps> activeProps={{ isFocused: true }}>
            <Button isDisabled={!isValid} onPress={onImport}>
              Import
            </Button>
          </Selection>
        </SelectionZone>
      </Box>
    </Box>
  )
}
