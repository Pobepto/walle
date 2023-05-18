import { JsonRpcProvider } from 'ethers'

import { BlockchainAction } from '@src/store'

export const loadChainId: BlockchainAction<'loadChainId'> =
  () => async (rpc) => {
    try {
      const provider = new JsonRpcProvider(rpc, 'any')
      const providerNetwork = await provider.getNetwork()

      return providerNetwork.chainId.toString()
    } catch {
      throw new Error("Can't get chain id from this rpc")
    }
  }
