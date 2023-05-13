import { getWalletData, save } from '@src/utils'

import { WalletAction } from '..'

export const encryptWallet: WalletAction<'encryptWallet'> =
  (set, get) => async (password) => {
    const { getWallet, activeWallet } = get()

    if (!activeWallet) {
      throw new Error('Weird')
    }

    const encrypted = await getWallet(true).encrypt(password)

    await save(encrypted, getWalletData(activeWallet))
  }
