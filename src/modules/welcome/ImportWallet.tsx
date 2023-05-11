import React, { useState } from 'react'
import { Box, Text } from 'ink'

import { Wallet } from '@ethersproject/wallet'
import { Button, ButtonProps } from '@src/components'
import { InputBox, InputBoxProps } from '@src/components/InputBox'
import {
  Selection,
  SelectionZone,
  SelectionZoneProps,
} from '@src/components/SelectionZone'
import { numberInRange, useForm } from '@src/hooks'
import { ROUTE, useNavigate } from '@src/routes'
import { useWalletStore, WalletType } from '@src/store'
import { getWalletType } from '@src/store/wallet/actions'

type Inputs = {
  mnemonicOrPrivateKey: string
  pathId: string
}

export const ImportWallet: React.FC = () => {
  const navigate = useNavigate()
  const importWallet = useWalletStore((state) => state.importWallet)
  const [advanced, setAdvanced] = useState(false)
  const [displaySecret, setVisibility] = useState(false)

  const { data, errors, isValid, register } = useForm<Inputs>({
    initialValues: {
      pathId: '',
    },
    rules: {
      mnemonicOrPrivateKey: (value) => {
        value = value.trim()

        if (!value) {
          return 'Please, enter phrase or private key'
        }

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
      pathId: numberInRange(0, 2147483647),
    },
  })

  const walletType = getWalletType(data.mnemonicOrPrivateKey)

  const onImport = () => {
    importWallet(data.mnemonicOrPrivateKey, Number(data.pathId))
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
        <Text>
          Enter the secret recovery phrase or private key below. This will
          import an existing wallet.
        </Text>
      </Box>
      {/* {walletType === WalletType.MNEMONIC && (
        <Box>
          <Text>Test 1</Text>
        </Box>
      )}
      {walletType === WalletType.PRIVATE_KEY && (
        <Box>
          <Text>Test 2</Text>
        </Box>
      )} */}
      <Box alignItems="center" flexDirection="column">
        <SelectionZone prevKey="upArrow" nextKey="downArrow" isActive>
          <Selection<InputBoxProps> activeProps={{ focus: true }}>
            <InputBox
              width="70%"
              error={errors.mnemonicOrPrivateKey}
              placeholder=" "
              mask={displaySecret ? undefined : '*'}
              onSubmit={() => setVisibility((v) => !v)}
              {...register('mnemonicOrPrivateKey')}
            />
          </Selection>
          {advanced && (
            <Selection<InputBoxProps> activeProps={{ focus: true }}>
              <InputBox
                label="pathId"
                width="50%"
                placeholder="0"
                disabled={walletType === WalletType.PRIVATE_KEY}
                error={
                  walletType === WalletType.PRIVATE_KEY
                    ? 'Wallet imported by private key does not support pathId'
                    : errors.pathId
                }
                {...register('pathId')}
              />
            </Selection>
          )}
          <Box>
            <Selection<SelectionZoneProps> activeProps={{ isActive: true }}>
              <SelectionZone prevKey="leftArrow" nextKey="rightArrow">
                <Selection<ButtonProps> activeProps={{ isFocused: true }}>
                  <Button onPress={navigate.back}>Back</Button>
                </Selection>
                {!advanced && (
                  <Selection<ButtonProps> activeProps={{ isFocused: true }}>
                    <Button onPress={() => setAdvanced(true)}>Settings</Button>
                  </Selection>
                )}
                <Selection<ButtonProps>
                  activeProps={{ isFocused: true }}
                  selectedByDefault
                >
                  <Button isDisabled={!isValid} onPress={onImport}>
                    Import
                  </Button>
                </Selection>
              </SelectionZone>
            </Selection>
          </Box>
        </SelectionZone>
      </Box>
    </Box>
  )
}
