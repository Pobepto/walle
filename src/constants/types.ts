export enum COLUMNS {
  MENU,
  MAIN,
  TOKENS,
}

export interface Chain {
  chainId: number
  name: string
  rpc: string
  currency: string
  explorer: string
}

export interface ExternalChain {
  chainId: number
  name: string
  rpc: string[]
  explorers?: {
    name: string
    url: string
    standard: 'none' | 'EIP3091'
  }[]
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
}

export interface Token {
  name: string
  symbol: string
  decimals: number
  address: string
  chainId: number
}
