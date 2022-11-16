import { JsonRpcProvider } from '@ethersproject/providers'
import { BlockchainAction } from '@src/store'

export const addChain: BlockchainAction<'addChain'> =
  (set, get) => async (chain) => {
    const provider = new JsonRpcProvider(chain.rpc, 'any')
    const providerNetwork = await provider.getNetwork()

    if (providerNetwork.chainId !== chain.chainId) {
      throw new Error('Invalid rpc')
    }

    const chains = get().chains.slice()

    chains.push(chain)

    set({ chains })
  }
