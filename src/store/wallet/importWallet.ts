import { Wallet } from '@ethersproject/wallet'
import { WalletAction } from '.'

export const importWallet: WalletAction = (set) => (mnemonic: string) => {
  try {
    const wallet = Wallet.fromMnemonic(mnemonic)
    const { mnemonic: { phrase } } = wallet

    set({ phrase })
  } catch (err) {
    console.log(err)
    throw new Error('Impossible to import wallet from mnemomic')
  }
}
