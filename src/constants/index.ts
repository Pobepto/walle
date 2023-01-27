import { Chain, Token } from './types'

export * from './types'

export const WALLE_LOGO = `
 _ _ _ _____ __    __    _____ 
| | | |  _  |  |  |  |  |   __|
| | | |     |  |__|  |__|   __|
|_____|__|__|_____|_____|_____|
`

export const GITHUB = 'https://github.com/Pobepto/walle'

export const GasPriceUnit = 'gwei'

export const DEFAULT_CHAINS: Chain[] = [
  {
    chainId: 1,
    name: 'Ethereum',
    rpc: 'https://eth.llamarpc.com',
    currency: 'ETH',
    explorer: 'https://etherscan.io/',
  },
]

export const DEFAULT_CHAIN = DEFAULT_CHAINS[0]

export const DEFAULT_TOKENS: Token[] = []
