import { useBlockchainStore, useWalletStore } from '@store'

export const useWallet = () => {
  const provider = useBlockchainStore((state) => state.provider)
  const getWallet = useWalletStore((state) => state.getWallet)

  return getWallet().connect(provider)
}
