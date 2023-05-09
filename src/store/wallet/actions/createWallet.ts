import { WalletAction, WalletType } from '..'

export const createWallet: WalletAction<'createWallet'> =
  (set) => (mnemonic) => {
    set({ mnemonicOrPrivateKey: mnemonic, type: WalletType.MNEMONIC })
  }
