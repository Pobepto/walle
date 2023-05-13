import { WalletAction, WalletType } from '..'

export const createWallet: WalletAction<'createWallet'> =
  (set) =>
  (mnemonic, accountIndex = 0, addressIndex = 0) => {
    set({
      mnemonicOrPrivateKey: mnemonic,
      accountIndex,
      addressIndex,
      type: WalletType.MNEMONIC,
      accounts: [
        {
          name: 'Main',
          accountIndex,
          addressIndex,
        },
      ],
    })
  }
