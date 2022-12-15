import { getWallet, WalletAction } from '..'

export const encryptWallet: WalletAction<'encryptWallet'> =
  () =>
  async (password): Promise<string> => {
    return getWallet(0).encrypt(password)
  }
