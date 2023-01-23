import { Nullable } from 'tsdef'

import { Wallet } from '@ethersproject/wallet'
import { useBlockchainStore, useWalletStore } from '@store'
import { getDerivationPath } from '@utils'

// TODO: Think about removing it
export const useWallet = (): Nullable<Wallet> => {
  const phrase = useWalletStore((state) => state.phrase)
  const pathId = useWalletStore((state) => state.pathId)
  const provider = useBlockchainStore((state) => state.provider)

  if (!phrase) return null

  try {
    return Wallet.fromMnemonic(phrase, getDerivationPath(pathId)).connect(
      provider,
    )
  } catch {
    return null
  }
}
