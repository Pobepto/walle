import { Wallet } from '@ethersproject/wallet'
import { useBlockchainStore, useWalletStore } from '@store'

export const useWallet = (): Wallet => {
  const provider = useBlockchainStore((state) => state.provider)
  const getWallet = useWalletStore((state) => state.getWallet)

  return getWallet().connect(provider)
}
