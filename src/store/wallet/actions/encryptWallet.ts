import { WalletAction } from '..'

export const encryptWallet: WalletAction<'encryptWallet'> =
  (set, get) =>
  async (password): Promise<string> => {
    return get().getWallet(0).encrypt(password)
  }
