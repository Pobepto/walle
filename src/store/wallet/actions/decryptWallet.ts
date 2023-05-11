import { Wallet } from '@ethersproject/wallet'

import { WalletAction, WalletType } from '..'

export const decryptWallet: WalletAction<'decryptWallet'> =
  (set) => async (password, encryptedWallet) => {
    const wallet = await Wallet.fromEncryptedJson(encryptedWallet, password)

    set({
      mnemonicOrPrivateKey: wallet.mnemonic?.phrase ?? wallet.privateKey,
      type: wallet.mnemonic?.phrase
        ? WalletType.MNEMONIC
        : WalletType.PRIVATE_KEY,
    })
  }
