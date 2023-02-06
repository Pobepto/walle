import { TokensAction } from '..'

export const deleteToken: TokensAction<'deleteToken'> =
  (set, get) => async (chainId, address) => {
    const { tokens } = get()

    const newTokens = [...tokens].filter(
      (token) => token.address !== address && token.chainId !== chainId,
    )

    set({ tokens: newTokens })
  }
