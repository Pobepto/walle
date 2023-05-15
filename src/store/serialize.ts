import {
  SerializedAppState,
  SerializedWalletState,
  useAppStore,
  useBlockchainStore,
  useTokensStore,
  useWalletConnectStore,
  useWalletStore,
} from '@src/store'

export const serializeWalletState = (): string => {
  const { chainId, chains } = useBlockchainStore.getState()
  const { store, requests } = useWalletConnectStore.getState()
  const { accountIndex, addressIndex, accounts } = useWalletStore.getState()
  const { tokens } = useTokensStore.getState()

  const fileObject: SerializedWalletState = {
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

export const serializeAppState = (): string => {
  const { wallets } = useAppStore.getState()

  const fileObject: SerializedAppState = {
    wallets,
  }

  return JSON.stringify(fileObject)
}
