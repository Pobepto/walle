import { DEFAULT_TOKENS, Token } from '@src/constants'
import { Action } from '..'
import { createWithSubscribeSelector } from '../createWithSubscribeSelector'
import { addToken, syncBalances } from './actions'

export interface TokensStore {
  tokens: Token[]
  balances: Map<string, string>
  syncBalances: () => Promise<void>
  balancesIsLoading: boolean
  addToken: (token: Omit<Token, 'chainId'>) => void
}

export type TokensAction<T extends keyof TokensStore> = Action<
  TokensStore,
  TokensStore[T]
>

export const useTokensStore = createWithSubscribeSelector<TokensStore>(
  (set, get) => ({
    tokens: DEFAULT_TOKENS,
    balances: new Map(),
    syncBalances: syncBalances(set, get),
    balancesIsLoading: true,
    addToken: addToken(set, get),
  }),
)
