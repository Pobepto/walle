import { WalletAction } from '..'

export const logout: WalletAction<'logout'> = (set) => () => {
  set({ phrase: '' })
}
