import { WalletAction } from '..'

export const deriveMnemonicAddress: WalletAction<'deriveMnemonicAddress'> =
  (set, get) => () => {
    const nextPathId = get().pathId + 1

    if (!get().phrase) {
      throw new Error('Phrase is null')
    }

    set({ pathId: nextPathId })
  }
