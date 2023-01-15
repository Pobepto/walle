import { useBlockchainStore } from './blockchain'
import { useTokensStore } from './tokens'
import { useWalletStore } from './wallet'

export const initSubscribers = () => {
  useBlockchainStore.subscribe(
    (state) => state.chainId,
    () => {
      useBlockchainStore.getState().updateProvider()
      useBlockchainStore.getState().getNativeBalance()
      useTokensStore.getState().syncBalances()
    },
    {
      fireImmediately: true,
    },
  )

  useTokensStore.subscribe(
    (state) => state.tokens,
    () => {
      useTokensStore.getState().syncBalances()
    },
  )

  useWalletStore.subscribe(
    (state) => [state.pathId, state.phrase],
    ([, phrase]) => {
      if (phrase) {
        useBlockchainStore.getState().getNativeBalance()
        useTokensStore.getState().syncBalances()
      }
    },
  )
}