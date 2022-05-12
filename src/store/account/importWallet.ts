import { Wallet } from '@ethersproject/wallet'
import { AccountAction } from '.'

export const importWallet: AccountAction = (set) => (mnemonic: string) => {
  try {
    const wallet = Wallet.fromMnemonic(mnemonic)
    const { mnemonic: { phrase } } = wallet

    set({ phrase })
  } catch (err) {
    console.log(err)
    throw new Error('Impossible to import wallet from mnemomic')
  }
}
