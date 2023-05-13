import { useWalletStore } from '@src/store'

import { getWalletSettings, save, WALLE_SETTINGS } from './fs'
import { serializeUserSettings, serializeWalletSettings } from './serialize'

export const saveUserSettings = () => {
  setTimeout(async () => {
    try {
      const { getWallet, activeWallet } = useWalletStore.getState()
      getWallet()
      await save(serializeWalletSettings(), getWalletSettings(activeWallet!))
      await save(serializeUserSettings(), WALLE_SETTINGS)
      saveUserSettings()
    } catch (error) {
      saveUserSettings()
    }
  }, 5_000)
}
