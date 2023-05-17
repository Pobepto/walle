import { HDNodeWallet, Wallet } from 'ethers'

import { getWalletDataPath } from '@src/store'
import { load } from '@src/utils'

import { WalletAction, WalletType } from '..'

export const decryptWallet: WalletAction<'decryptWallet'> =
  (set) => async (walletName, password) => {
    const encryptedWallet = await load(getWalletDataPath(walletName))
    const wallet = await Wallet.fromEncryptedJson(encryptedWallet, password)

    set({
      activeWallet: walletName,
      mnemonicOrPrivateKey:
        wallet instanceof HDNodeWallet && wallet.mnemonic
          ? wallet.mnemonic.phrase
          : wallet.privateKey,
      type:
        wallet instanceof HDNodeWallet && wallet.mnemonic
          ? WalletType.MNEMONIC
          : WalletType.PRIVATE_KEY,
    })
  }
