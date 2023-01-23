import { useWalletStore } from '@src/store'

import { save, USER_SETTINGS } from './fs'
import { serialize } from './serialize'

export const saveUserSettings = () => {
  setTimeout(() => {
    try {
      useWalletStore.getState().getWallet()
      save(serialize(), USER_SETTINGS).then(saveUserSettings)
    } catch (error) {
      saveUserSettings()
    }
  }, 5_000)
}
