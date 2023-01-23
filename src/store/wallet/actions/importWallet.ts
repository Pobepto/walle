import { Wallet } from '@ethersproject/wallet'

import { WalletAction } from '..'

export const importWallet: WalletAction<'importWallet'> =
  (set) => (mnemonic) => {
    try {
      const {
        mnemonic: { phrase },
      } = Wallet.fromMnemonic(mnemonic)

      set({ phrase })
    } catch (err) {
      throw new Error('Impossible to import wallet from mnemomic')
    }
  }
