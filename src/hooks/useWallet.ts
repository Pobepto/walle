import { Wallet } from '@ethersproject/wallet'
import { Nullable } from 'tsdef'
import { useWalletStore } from '../store'
import { getDerivationPath } from '../utils'

export const useWallet = (): Nullable<Wallet> => {
  const phrase = useWalletStore((state) => state.phrase)
  const pathId = useWalletStore((state) => state.pathId)

  try {
    return Wallet.fromMnemonic(phrase, getDerivationPath(pathId))
  } catch {
    return null
  }
}
