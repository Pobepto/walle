import { Wallet } from '@ethersproject/wallet'
import { AccountAction } from '.'

export const generateWallet: AccountAction = (set) => () => {
  const wallet = Wallet.createRandom()
  const { mnemonic: { phrase } } = wallet

  set({ phrase })
}
