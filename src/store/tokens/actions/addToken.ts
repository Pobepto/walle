import { useBlockchainStore } from '@src/store'
import { TokensAction } from '..'

export const addToken: TokensAction<'addToken'> =
  (set, get) => async (token) => {
    const chainId = useBlockchainStore.getState().chainId
    const tokens = get().tokens.slice()

    const alreadyAdded = tokens.some((t) => {
      return t.address === token.address && t.chainId === chainId
    })

    if (!alreadyAdded) {
      tokens.push({ ...token, chainId })

      set({ tokens })
    }
  }
