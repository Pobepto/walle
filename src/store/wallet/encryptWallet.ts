import { Wallet } from '@ethersproject/wallet'
import { WalletAction } from '.'

export const encryptWallet: WalletAction<'encryptWallet'> =
  (set, get) => async (password) => {
    const { phrase } = get()

    const encrypted = await Wallet.fromMnemonic(phrase).encrypt(password)

    console.log('encrypted', encrypted)
  }
