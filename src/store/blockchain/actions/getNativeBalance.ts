import { getWallet } from '@src/store'
import { BlockchainAction } from '..'

export const getNativeBalance: BlockchainAction<'getNativeBalance'> =
  (set, get) => async () => {
    set({ nativeBalanceIsLoading: true })
    const { provider } = get()

    try {
      const wallet = getWallet()
      const balance = await provider.getBalance(wallet.address)

      set({ nativeBalance: balance.toString(), nativeBalanceIsLoading: false })
    } catch (err) {
      set({ nativeBalance: null, nativeBalanceIsLoading: false })
    }
  }
