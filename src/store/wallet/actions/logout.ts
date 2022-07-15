import { WalletAction } from '..'

export const logout: WalletAction = (set) => () => {
  set({ phrase: '' })
}
