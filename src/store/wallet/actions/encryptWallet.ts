import { Wallet } from '@ethersproject/wallet'
import { WalletAction } from '..'

export const encryptWallet: WalletAction<'encryptWallet'> =
  (set, get) =>
  async (password): Promise<string> => {
    const { phrase } = get()

    if (!phrase) {
      throw new Error('Phrase is null')
    }

    const encrypted = await Wallet.fromMnemonic(phrase).encrypt(password)

    return encrypted
  }
