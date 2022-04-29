import { Wallet } from '@ethersproject/wallet'
import { AccountAction } from '.'

export const importWallet: AccountAction = (set) => (mnemonic: string) => {
  try {
    const wallet = Wallet.fromMnemonic(mnemonic)
    const { mnemonic: { phrase } } = wallet

    set({ phrase })
  } catch {
    console.log('Implement: validation in input')
  }
}
