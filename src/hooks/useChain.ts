import { JsonRpcProvider } from '@ethersproject/providers'
import { useMemo } from 'react'
import { Chain, useBlockchainStore } from '../store/blockchain'

export interface ChainWithProvider extends Chain {
  provider: JsonRpcProvider;
}

export const useChain = (chainId: number): ChainWithProvider => {
  const chains = useBlockchainStore(store => store.chains)

  return useMemo(() => {
    const chain = chains.find(chain => chain.chainId === chainId)
    // const provider = new WebSocketProvider(chain.rpc)
    const provider = new JsonRpcProvider(chain.rpc)

    provider.on('error', () => {
      // nothing
    })

    return {
      ...chain,
      provider
    }
  }, [chainId])
}
