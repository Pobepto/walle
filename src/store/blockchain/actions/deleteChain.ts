import { BlockchainAction } from '@src/store'

export const deleteChain: BlockchainAction<'deleteChain'> =
  (set, get) => (chainId) => {
    const { chains, chainId: currentChainId } = get()

    if (chains.length > 1) {
      const newChains = [...chains].filter((chain) => chain.chainId !== chainId)
      const newChainId =
        chainId === currentChainId ? newChains[0].chainId : currentChainId

      set({ chains: newChains, chainId: newChainId })
    }
  }
