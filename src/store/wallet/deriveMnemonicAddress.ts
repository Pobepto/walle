import { Wallet } from '@ethersproject/wallet'
import { WalletAction } from '.'
import { getDerivationPath } from '@utils'

export const deriveMnemonicAddress: WalletAction = (set, get) => () => {
  const nextPathId = get().pathId + 1
  const path = getDerivationPath(nextPathId)
  const wallet = Wallet.fromMnemonic(get().phrase, path)
  const {
    mnemonic: { phrase },
  } = wallet

  set({ phrase, pathId: nextPathId })
}
