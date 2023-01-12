import {
  useBlockchainStore,
  useWalletConnectStore,
  useWalletStore,
  useTokensStore,
  SerializedStore,
} from '@src/store'

export const serialize = (): string => {
  const { chainId, chains } = useBlockchainStore.getState()
  const { store, requests } = useWalletConnectStore.getState()
  const { pathId } = useWalletStore.getState()
  const { tokens } = useTokensStore.getState()

  const fileObject: SerializedStore = {
    blockchainStore: {
      chainId,
      chains,
    },
    walletConnectStore: {
      store,
      requests,
    },
    walletStore: {
      pathId,
    },
    tokensStore: {
      tokens,
    },
  }

  return JSON.stringify(fileObject)
}
