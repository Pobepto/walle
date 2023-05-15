import { useAppStore } from '@src/store/app'

import { WalletAction, WalletType } from '..'

export const createWallet: WalletAction<'createWallet'> =
  (set) =>
  (name, mnemonic, accountIndex = 0, addressIndex = 0) => {
    useAppStore.getState().addWallet(name)

    set({
      activeWallet: name,
      mnemonicOrPrivateKey: mnemonic,
      accountIndex,
      addressIndex,
      type: WalletType.MNEMONIC,
      accounts: [
        {
          name: 'Main',
          accountIndex,
          addressIndex,
        },
      ],
    })
  }
