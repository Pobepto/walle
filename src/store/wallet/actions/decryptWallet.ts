import { Wallet } from '@ethersproject/wallet'

import { WalletAction } from '..'

export const decryptWallet: WalletAction<'decryptWallet'> =
  (set) => async (password, encryptedWallet) => {
    const wallet = await Wallet.fromEncryptedJson(encryptedWallet, password)

    set({ mnemonicOrPrivateKey: wallet.mnemonic.phrase })
  }
