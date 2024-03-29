import { useBlockchainStore } from '@store/blockchain'

export const useChain = () => {
  const chainId = useBlockchainStore((store) => store.chainId)
  const chains = useBlockchainStore((store) => store.chains)

  const chain = chains.find((chain) => chain.chainId === chainId)

  if (!chain) {
    throw new Error('useChain: chainId not found in chains')
  }

  return chain
}
