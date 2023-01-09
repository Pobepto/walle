import { useSelectionZone } from '@src/components/SelectionZone'
import { ROUTE, useNavigate } from '@src/routes'
import { COLUMNS, useWalletConnectStore } from '@src/store'
import { SessionRequest } from '@src/store/wallet-connect/actions'
import { EIP155_SIGNING_METHODS } from '@src/store/wallet-connect/constants'

export const useWalletConnectRequestHandler = () => {
  const navigate = useNavigate()
  const parentZone = useSelectionZone()!
  const approveRequest = useWalletConnectStore((store) => store.approveRequest)
  const rejectRequest = useWalletConnectStore((store) => store.rejectRequest)

  const handler = (sessionRequest: SessionRequest) => {
    const {
      params: { request },
    } = sessionRequest

    switch (request.method) {
      case EIP155_SIGNING_METHODS.ETH_SIGN:
        parentZone.select(COLUMNS.MAIN)
        return navigate(ROUTE.SIGN_MESSAGE, {
          message: request.params[1],
          warning: true,
          onReject: () => rejectRequest(sessionRequest),
          onSign: (signedMessage) =>
            approveRequest(sessionRequest, signedMessage),
        })
      case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
        parentZone.select(COLUMNS.MAIN)
        return navigate(ROUTE.SIGN_MESSAGE, {
          message: request.params[0],
          onReject: () => rejectRequest(sessionRequest),
          onSign: (signedMessage) =>
            approveRequest(sessionRequest, signedMessage),
        })

      case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
      case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
      case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
        break

      case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
      case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
        parentZone.select(COLUMNS.MAIN)
        return navigate(ROUTE.CONFIRM_TRANSACTION, {
          populatedTx: request.params[0],
          onRejectTx: () => rejectRequest(sessionRequest),
          onApproveTx: (hash) => approveRequest(sessionRequest, hash),
        })

      default:
        throw new Error(`${request.method} not supported`)
    }
  }

  return handler
}
