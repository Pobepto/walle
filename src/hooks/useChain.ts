import { WebSocketProvider } from '@ethersproject/providers'
import { useMemo } from 'react'
import { Chain, useBlockchainStore } from '../store/blockchain'

export interface ChainWithProvider extends Chain {
  provider: WebSocketProvider;
  isReady: boolean;
}

export const useChain = (chainId: number): ChainWithProvider => {
  const chains = useBlockchainStore(store => store.chains)

  return useMemo(() => {
    const chain = chains.find(chain => chain.chainId === chainId)
    const provider = new WebSocketProvider(chain.rpc)

    provider._websocket.onerror = () => null

    return {
      ...chain,
      provider,
      get isReady () {
        return provider._wsReady
      }
    }
  }, [chainId])
}
