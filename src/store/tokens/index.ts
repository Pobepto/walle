import { Nullable } from 'tsdef'

import { DEFAULT_TOKENS, Token } from '@src/constants'

import { createWithSubscribeSelector } from '../createWithSubscribeSelector'
import { Action } from '..'

import { addToken, loadBalances } from './actions'

export interface TokensStore {
  tokens: Token[]
  balances: Map<string, Nullable<string>>
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
