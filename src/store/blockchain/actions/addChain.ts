import { BlockchainAction, Chain } from '@src/store'

export const addChain: BlockchainAction<'addChain'> =
  (set, get) => async (chain: Chain) => {
    const chains = get().chains.slice()

    chains.push(chain)

    set({ chains })
  }
