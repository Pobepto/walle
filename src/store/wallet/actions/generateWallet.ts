import { Wallet } from '@ethersproject/wallet'

import { WalletAction, WalletType } from '..'

export const generateWallet: WalletAction<'generateWallet'> = (set) => () => {
  const wallet = Wallet.createRandom()
  const {
    mnemonic: { phrase },
  } = wallet

  set({ mnemonicOrPrivateKey: phrase, type: WalletType.MNEMONIC })
}
