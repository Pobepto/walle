import { WalletAction } from '..'

export const logout: WalletAction<'logout'> = (set) => () => {
  set({
    activeWallet: null,
    mnemonicOrPrivateKey: null,
    type: null,
    accounts: [],
    accountIndex: 0,
    addressIndex: 0,
  })
}
