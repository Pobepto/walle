import { BlockchainAction } from '@src/store'

export const addChain: BlockchainAction<'addChain'> =
  (set, get) => async (chain) => {
    const chains = get().chains.slice()

    chains.push(chain)

    set({ chains })
  }
