import { WalletAction, WalletType } from '..'

export const createWallet: WalletAction<'createWallet'> =
  (set, get) =>
  (name, mnemonic, accountIndex = 0, addressIndex = 0) => {
    const { wallets } = get()

    set({
      activeWallet: name,
      wallets: [...wallets, name],
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
