import {
  SerializedStore,
  useBlockchainStore,
  useWalletConnectStore,
  useWalletStore,
  useTokensStore,
} from '@src/store'

export const deserialize = (store: SerializedStore) => {
  useBlockchainStore.setState(store.blockchainStore)
  useWalletConnectStore.setState(store.walletConnectStore)
  useWalletStore.setState(store.walletStore)
  useTokensStore.setState(store.tokensStore)
}
