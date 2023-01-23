import { WalletConnectAction } from '@src/store'
import { signClient } from '@src/wallet-connect'
import { getSdkError } from '@walletconnect/utils'

export const reject: WalletConnectAction<'reject'> = () => (proposal) => {
  return signClient.reject({
    id: proposal.id,
    reason: getSdkError('USER_DISCONNECTED'),
  })
}
