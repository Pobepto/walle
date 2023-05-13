import {
  SerializedUserSettings,
  SerializedWalletSettings,
  useBlockchainStore,
  useTokensStore,
  useWalletConnectStore,
  useWalletStore,
} from '@src/store'

import { getWalletSettings, isFileExist, load, WALLE_SETTINGS } from './fs'

export const restoreWalletSettings = async (wallet: string) => {
  const isExist = await isFileExist(getWalletSettings(wallet))
  if (isExist) {
    const store: SerializedWalletSettings = JSON.parse(
      await load(getWalletSettings(wallet)),
    )
    useBlockchainStore.setState(store.blockchainStore)
    useWalletConnectStore.setState(store.walletConnectStore)
    useWalletStore.setState(store.walletStore)
    useTokensStore.setState(store.tokensStore)
  }
}

export const restoreUserSettings = async () => {
  const isExist = await isFileExist(WALLE_SETTINGS)
  if (isExist) {
    const store: SerializedUserSettings = JSON.parse(await load(WALLE_SETTINGS))
    useWalletStore.setState(store.walletStore)
  }
}
