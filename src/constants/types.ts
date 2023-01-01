export interface Chain {
  chainId: number
  name: string
  rpc: string
  currency: string
  explorer: string
}

export interface Token {
  name: string
  symbol: string
  decimals: number
  address: string
  chainId: number
}
