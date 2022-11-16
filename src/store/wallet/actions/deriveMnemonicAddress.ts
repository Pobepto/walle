import { Wallet } from '@ethersproject/wallet'
import { WalletAction } from '..'
import { getDerivationPath } from '@utils'

export const deriveMnemonicAddress: WalletAction<'deriveMnemonicAddress'> =
  (set, get) => () => {
    const nextPathId = get().pathId + 1
    const path = getDerivationPath(nextPathId)

    if (!get().phrase) {
      throw new Error('Phrase is null')
    }

    // зачем это вообще мы тут делаем?
    const wallet = Wallet.fromMnemonic(get().phrase!, path)
    const {
      mnemonic: { phrase },
    } = wallet

    set({ phrase, pathId: nextPathId })
  }
