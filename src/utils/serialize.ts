import {
  SerializedStore,
  useBlockchainStore,
  useTokensStore,
  useWalletConnectStore,
  useWalletStore,
} from '@src/store'

export const serialize = (): string => {
  const { chainId, chains } = useBlockchainStore.getState()
  const { store, requests } = useWalletConnectStore.getState()
  const { pathId, accounts } = useWalletStore.getState()
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
      accounts,
    },
    tokensStore: {
      tokens,
    },
  }

  return JSON.stringify(fileObject)
}
