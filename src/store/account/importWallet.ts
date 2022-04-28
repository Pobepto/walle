import { Wallet } from '@ethersproject/wallet'
import { AccountAction } from '.'

export const importWallet: AccountAction = (set) => (mnemonic: string) => {
  const wallet = Wallet.fromMnemonic(mnemonic)
  const { mnemonic: { phrase } } = wallet

  set({ phrase })
}
