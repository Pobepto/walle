import {
  APP_SETTINGS,
  getWalletSettingsPath,
  serializeAppState,
  serializeWalletState,
  useWalletStore,
} from '@store'
import { save } from '@utils/fs'

export const runStoreAutosave = () => {
  setTimeout(async () => {
    try {
      const { activeWallet } = useWalletStore.getState()

      if (activeWallet) {
        await save(serializeWalletState(), getWalletSettingsPath(activeWallet))
      }

      await save(serializeAppState(), APP_SETTINGS)
    } catch {
      //
    }

    runStoreAutosave()
  }, 5_000)
}
