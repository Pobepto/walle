import { DEFAULT_TOKENS, Token, TokenBalance } from '@src/constants'
import { Action } from '..'
import { createWithSubscribeSelector } from '../createWithSubscribeSelector'
import { addToken, loadBalances } from './actions'

export interface TokensStore {
  tokens: Token[]
  balances: Map<string, TokenBalance>
  loadBalances: () => Promise<void>
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
    loadBalances: loadBalances(set, get),
    addToken: addToken(set, get),
  }),
)
