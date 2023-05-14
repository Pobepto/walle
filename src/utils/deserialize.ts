import {
  SerializedUserSettings,
  SerializedWalletSettings,
  useBlockchainStore,
  useTokensStore,
  useWalletConnectStore,
  useWalletStore,
} from '@src/store'

import {
  getWalletDataPath,
  getWalletSettingsPath,
  isFileExist,
  load,
  WALLE_SETTINGS,
} from './fs'

export const restoreWalletSettings = async (wallet: string) => {
  const isExist = await isFileExist(getWalletSettingsPath(wallet))
  if (isExist) {
    const store: SerializedWalletSettings = JSON.parse(
      await load(getWalletSettingsPath(wallet)),
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
    const settings: SerializedUserSettings = JSON.parse(
      await load(WALLE_SETTINGS),
    )
    const { wallets } = settings
    const existsWallets = await Promise.all(
      wallets.map((wallet) => isFileExist(getWalletDataPath(wallet))),
    )
    useWalletStore.setState({
      wallets: wallets.filter((_, i) => existsWallets[i]),
    })
  }
}
