import { Wallet } from '@ethersproject/wallet'
import { BlockchainAction } from '.'
import { useWalletStore } from '..'
import { getDerivationPath } from '../../utils'

export const getNativeBalance: BlockchainAction =
  (set, get) => async (): Promise<void> => {
    set({ nativeBalanceIsLoading: true })
    const { provider } = get()

    const { phrase, pathId } = useWalletStore.getState()

    if (!phrase) {
      return
    }

    try {
      const wallet = Wallet.fromMnemonic(phrase, getDerivationPath(pathId))
      const balance = await provider.getBalance(wallet.address)

      set({ nativeBalance: balance.toString(), nativeBalanceIsLoading: false })
    } catch (err) {
      set({ nativeBalance: '🤔', nativeBalanceIsLoading: false })
    }
  }
