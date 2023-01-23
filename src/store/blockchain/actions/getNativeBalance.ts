import { useWalletStore } from '@src/store/wallet'

import { BlockchainAction } from '..'

export const getNativeBalance: BlockchainAction<'getNativeBalance'> =
  (set, get) => async () => {
    const { provider } = get()
    const { getWallet } = useWalletStore.getState()

    try {
      const wallet = getWallet()
      const balance = await provider.getBalance(wallet.address)

      set({ nativeBalance: balance.toString() })
    } catch (err) {
      set({ nativeBalance: null })
    }
  }
