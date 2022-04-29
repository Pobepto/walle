import { Wallet } from '@ethersproject/wallet'
import { Nullable } from 'tsdef'
import { useAccountStore } from '../store'
import { getDerivationPath } from '../utils'

export const useWallet = (): Nullable<Wallet> => {
  const phrase = useAccountStore(state => state.phrase)
  const pathId = useAccountStore(state => state.pathId)

  try {
    return Wallet.fromMnemonic(phrase, getDerivationPath(pathId))
  } catch {
    return null
  }
}
