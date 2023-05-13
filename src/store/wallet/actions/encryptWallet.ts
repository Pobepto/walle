import { WalletAction } from '..'

export const encryptWallet: WalletAction<'encryptWallet'> =
  (set, get) =>
  async (password): Promise<string> => {
    return get().getWallet(true).encrypt(password)
  }
