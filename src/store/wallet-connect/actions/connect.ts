import { WalletConnectAction } from '@src/store'
import { signClient } from '@src/wallet-connect'
import { ProposalTypes, SignClientTypes } from '@walletconnect/types'
import { parseUri } from '@walletconnect/utils'

export type SessionProposal = Omit<
  SignClientTypes.BaseEventArgs<ProposalTypes.Struct>,
  'topic'
>

export type SessionRequest = SignClientTypes.EventArguments['session_request']

export const connect: WalletConnectAction<'connect'> = () => async (uri) => {
  const { version } = parseUri(uri)

  if (version !== 2) {
    throw new Error(`WalletConnect v${version} not supported`)
  }

  await signClient.pair({ uri })
}
