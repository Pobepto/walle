import {
  SerializedUserSettings,
  SerializedWalletSettings,
  useBlockchainStore,
  useTokensStore,
  useWalletConnectStore,
  useWalletStore,
} from '@src/store'

export const serializeWalletSettings = (): string => {
  const { chainId, chains } = useBlockchainStore.getState()
  const { store, requests } = useWalletConnectStore.getState()
  const { accountIndex, addressIndex, accounts } = useWalletStore.getState()
  const { tokens } = useTokensStore.getState()

  const fileObject: SerializedWalletSettings = {
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

export const serializeUserSettings = (): string => {
  const { wallets } = useWalletStore.getState()

  const fileObject: SerializedUserSettings = {
    walletStore: {
      wallets,
    },
  }

  return JSON.stringify(fileObject)
}
