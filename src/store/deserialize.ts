import {
  APP_SETTINGS,
  getWalletDataPath,
  getWalletSettingsPath,
  SerializedAppState,
  SerializedWalletState,
  useAppStore,
  useBlockchainStore,
  useTokensStore,
  useWalletConnectStore,
  useWalletStore,
} from '@store'
import { isFileExist, load } from '@utils/fs'

export const restoreWalletState = async (wallet: string) => {
  const walletPath = getWalletSettingsPath(wallet)
  const isExist = await isFileExist(walletPath)

  if (isExist) {
    const rawState = await load(walletPath)
    const state: SerializedWalletState = JSON.parse(rawState)

    useBlockchainStore.setState(state.blockchainStore)
    useWalletConnectStore.setState(state.walletConnectStore)
    useWalletStore.setState(state.walletStore)
    useTokensStore.setState(state.tokensStore)
  }
}

export const restoreAppState = async () => {
  const isExist = await isFileExist(APP_SETTINGS)

  if (isExist) {
    const rawState = await load(APP_SETTINGS)
    const state: SerializedAppState = JSON.parse(rawState)

    const { wallets } = state
    const existsWallets = await Promise.all(
      wallets.map((wallet) => isFileExist(getWalletDataPath(wallet))),
    )
    useAppStore.setState({
      wallets: wallets.filter((_, i) => existsWallets[i]),
    })
  }
}
