export interface Chain {
  chainId: number
  name: string
  rpc: string
  currency: string
  explorer: string
}

export const CHAINS: Chain[] = [
  {
    chainId: 97,
    name: 'BNB Smart Chain',
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
