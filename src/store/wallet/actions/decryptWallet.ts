import { Wallet } from '@ethersproject/wallet'
import { getWalletData, load } from '@src/utils'

import { WalletAction, WalletType } from '..'

export const decryptWallet: WalletAction<'decryptWallet'> =
  (set) => async (walletName, password) => {
    const encryptedWallet = await load(getWalletData(walletName))
    const wallet = await Wallet.fromEncryptedJson(encryptedWallet, password)

    set({
      activeWallet: walletName,
      mnemonicOrPrivateKey: wallet.mnemonic?.phrase ?? wallet.privateKey,
      type: wallet.mnemonic?.phrase
        ? WalletType.MNEMONIC
        : WalletType.PRIVATE_KEY,
    })
  }
