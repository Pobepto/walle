import { WalletAction, WalletType } from '..'

export const createWallet: WalletAction<'createWallet'> =
  (set) =>
  (mnemonic, pathId = 0) => {
    set({
      mnemonicOrPrivateKey: mnemonic,
      activePathId: pathId,
      type: WalletType.MNEMONIC,
      accounts: [
        {
          name: 'Main',
          pathId,
        },
      ],
    })
  }
