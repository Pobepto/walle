import { JsonRpcProvider } from 'ethers'

import { BlockchainAction } from '@src/store'

export const addChain: BlockchainAction<'addChain'> =
  (set, get) => async (chain) => {
    const provider = new JsonRpcProvider(chain.rpc, 'any')
    const providerNetwork = await provider.getNetwork()

    if (Number(providerNetwork.chainId) !== chain.chainId) {
      throw new Error('Invalid rpc')
    }

    const chains = [...get().chains]

    const alreadyAddedChain = chains.find((c) => c.chainId === chain.chainId)

    if (alreadyAddedChain) {
      Object.assign(alreadyAddedChain, chain)
    } else {
      chains.push(chain)
    }

    set({ chains })
  }
