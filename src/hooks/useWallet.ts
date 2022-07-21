import { Wallet } from '@ethersproject/wallet'
import { Nullable } from 'tsdef'
import { useBlockchainStore, useWalletStore } from '@store'
import { getDerivationPath } from '@utils'

export const useWallet = (): Nullable<Wallet> => {
  const phrase = useWalletStore((state) => state.phrase)
  const pathId = useWalletStore((state) => state.pathId)
  const provider = useBlockchainStore((state) => state.provider)

  if (!phrase) return null

  try {
    const wallet = Wallet.fromMnemonic(phrase, getDerivationPath(pathId))
    return wallet.connect(provider)
  } catch {
    return null
  }
}
