import { Wallet } from '@ethersproject/wallet'
import { WalletAction } from '..'

export const generateWallet: WalletAction<'generateWallet'> = (set) => () => {
  const wallet = Wallet.createRandom()
  const {
    mnemonic: { phrase },
  } = wallet

  set({ phrase })
}
