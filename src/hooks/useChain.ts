import { Chain, useBlockchainStore } from '../store/blockchain'

export const useChain = (): Chain => {
  const chainId = useBlockchainStore(store => store.chainId)
  const chains = useBlockchainStore(store => store.chains)

  return chains.find(chain => chain.chainId === chainId)
}
