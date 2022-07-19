import { Action } from '..'
import { createWithSubscribeSelector } from '../createWithSubscribeSelector'
import { addToken, syncBalances } from './actions'

export interface Token {
  name: string
  symbol: string
  decimals: number
  address: string
  chainId: number
}

export type Currency = Omit<Token, 'address'>

export interface TokensStore {
  tokens: Token[]
  balances: Map<string, string>
  syncBalances: () => Promise<void>
  balancesIsLoading: boolean
  addToken: (token: Omit<Token, 'chainId'>) => void
}

export type TokensAction<T extends keyof TokensStore = any> = Action<
  TokensStore,
  TokensStore[T]
>

export const useTokensStore = createWithSubscribeSelector<TokensStore>(
  (set, get) => ({
    tokens: [
      {
        name: 'EYWA',
        symbol: 'EYWA',
        decimals: 18,
        address: '0x8d12A197c9d54c76f8Eb278c230eAF4487DaE03',
        chainId: 97,
      },
      {
        name: 'BUSD',
        symbol: 'BUSD',
        decimals: 18,
        address: '0x9d12A197c9d54c76f8Eb278c230eAF4487DaE03',
        chainId: 97,
      },
      {
        name: 'EYWA',
        symbol: 'EYWA',
        decimals: 18,
        address: '0x8d12A197c9d54c76f8Eb278c230eAF4487DaE03',
        chainId: 4,
      },
      {
        name: 'USDT',
        symbol: 'USDT',
        decimals: 18,
        address: '0x9d12A197c9d54c76f8Eb278c230eAF4487DaE03',
        chainId: 4,
      },
    ],
    balances: new Map(),
    syncBalances: syncBalances(set, get),
    balancesIsLoading: true,
    addToken: addToken(set, get),
  }),
)

useTokensStore.subscribe(
  (state) => state.tokens,
  () => {
    useTokensStore.getState().syncBalances()
  },
)
