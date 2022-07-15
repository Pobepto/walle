import { useBlockchainStore } from '@src/store'
import { Token, TokensAction } from '..'

export const addToken: TokensAction<'addToken'> =
  (set, get) => async (token: Omit<Token, 'chainId'>) => {
    const chainId = useBlockchainStore.getState().chainId
    const tokens = get().tokens.slice()

    tokens.push({ ...token, chainId })

    set({ tokens })
  }
