import { useWalletStore } from '@src/store/wallet'
import { BlockchainAction } from '..'

export const getNativeBalance: BlockchainAction<'getNativeBalance'> =
  (set, get) => async () => {
    set({ nativeBalanceIsLoading: true })
    const { provider } = get()
    const { getWallet } = useWalletStore.getState()

    try {
      const wallet = getWallet()
      const balance = await provider.getBalance(wallet.address)

      set({ nativeBalance: balance.toString(), nativeBalanceIsLoading: false })
    } catch (err) {
      set({ nativeBalance: null, nativeBalanceIsLoading: false })
    }
  }
