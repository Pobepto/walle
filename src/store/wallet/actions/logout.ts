import { WalletAction } from '..'

export const logout: WalletAction<'logout'> = (set) => () => {
  set({ mnemonicOrPrivateKey: null, type: null })
}
