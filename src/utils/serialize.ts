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
  const { accountIndex, addressIndex, accounts } = useWalletStore.getState()
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
      accountIndex,
      addressIndex,
      accounts,
    },
    tokensStore: {
      tokens,
    },
  }

  return JSON.stringify(fileObject)
}
