import { Chain, Token } from './types'

export * from './types'

export const GasPriceUnit = 'gwei'

export const DEFAULT_CHAINS: Chain[] = [
  {
    chainId: 97,
    name: 'BNB Smart Chain Testnet',
    rpc: 'https://data-seed-prebsc-2-s1.binance.org:8545/',
    currency: 'BNB',
    explorer: 'http://testnet.bscscan.com/',
  },
  {
    chainId: 4,
    name: 'Ethereum Rinkeby',
    rpc: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    currency: 'ETH',
    explorer: 'https://rinkeby.etherscan.io/',
  },
  {
    chainId: 80001,
    name: 'Polygon Mumbai',
    rpc: 'https://rpc-mumbai.maticvigil.com',
    currency: 'Matic',
    explorer: 'https://mumbai.polygonscan.com/',
  },
]

export const DEFAULT_TOKENS: Token[] = [
  {
    name: 'USDT',
    symbol: 'USDT',
    decimals: 18,
    address: '0xf16eec3a587ba34768a4bb9cb9b7b1d66d250227',
    chainId: 97,
  },
  {
    name: 'USDT',
    symbol: 'USDT',
    decimals: 18,
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    chainId: 4,
  },
]
