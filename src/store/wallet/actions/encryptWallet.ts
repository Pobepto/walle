import { getWallet, WalletAction } from '..'

export const encryptWallet: WalletAction<'encryptWallet'> =
  (set, get) =>
  async (password): Promise<string> => {
    return getWallet(0).encrypt(password)
  }
