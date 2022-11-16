import { Wallet } from '@ethersproject/wallet'
import { WalletAction } from '..'

export const importWallet: WalletAction<'importWallet'> =
  (set) => (mnemonic) => {
    try {
      const wallet = Wallet.fromMnemonic(mnemonic)
      const {
        mnemonic: { phrase },
      } = wallet

      set({ phrase })
    } catch (err) {
      throw new Error('Impossible to import wallet from mnemomic')
    }
  }
