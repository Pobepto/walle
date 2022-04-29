import { WebSocketProvider } from '@ethersproject/providers'
import { useBlockchainStore } from '../store/blockchain'

export const useProvider = (chainId: number) => {
  const chains = useBlockchainStore(store => store.chains)

  const chain = chains.find(chain => chain.chainId === chainId)

  return new WebSocketProvider(chain.rpc)
}
