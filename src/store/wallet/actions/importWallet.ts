import { Wallet } from '@ethersproject/wallet'
import { useAppStore } from '@src/store/app'

import { WalletAction, WalletType } from '..'

export const getWalletType = (mnemonicOrPrivateKey: string) => {
  try {
    new Wallet(mnemonicOrPrivateKey)
    return WalletType.PRIVATE_KEY
  } catch {
    try {
      Wallet.fromMnemonic(mnemonicOrPrivateKey)
      return WalletType.MNEMONIC
    } catch {
      return null
    }
  }
}

export const importWallet: WalletAction<'importWallet'> =
  (set) =>
  (name, mnemonicOrPrivateKey, accountIndex = 0, addressIndex = 0) => {
    useAppStore.getState().addWallet(name)

    set({
      activeWallet: name,
      mnemonicOrPrivateKey,
      accountIndex,
      addressIndex,
      type: getWalletType(mnemonicOrPrivateKey),
      accounts: [
        {
          name: 'Main',
          accountIndex,
          addressIndex,
        },
      ],
    })
  }
