import { Wallet } from '@ethersproject/wallet'

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
  (set) => (mnemonicOrPrivateKey) => {
    set({ mnemonicOrPrivateKey, type: getWalletType(mnemonicOrPrivateKey) })
  }
