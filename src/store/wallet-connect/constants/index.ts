import type { SignClientTypes } from '@walletconnect/types'

export const EIP155_SIGNING_METHODS = {
  PERSONAL_SIGN: 'personal_sign',
  ETH_SIGN: 'eth_sign',
  ETH_SIGN_TRANSACTION: 'eth_signTransaction',
  ETH_SIGN_TYPED_DATA: 'eth_signTypedData',
  ETH_SIGN_TYPED_DATA_V3: 'eth_signTypedData_v3',
  ETH_SIGN_TYPED_DATA_V4: 'eth_signTypedData_v4',
  ETH_SEND_RAW_TRANSACTION: 'eth_sendRawTransaction',
  ETH_SEND_TRANSACTION: 'eth_sendTransaction',
}

export const SIGN_CLIENT_OPTIONS: SignClientTypes.Options = {
  // logger: 'debug',
  projectId: '83bd22fbdde53e66f042e2c6fc181fc3',
  relayUrl: 'wss://relay.walletconnect.com',
  metadata: {
    name: 'Walle Wallet',
    description: 'Walle Wallet for WalletConnect',
    url: 'https://walletconnect.com/',
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
  },
}