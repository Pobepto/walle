import { useBlockchainStore } from './blockchain'
import { useTokensStore } from './tokens'
import { useWalletStore } from './wallet'

export const subscribe = () => {
  useBlockchainStore.subscribe(
    (state) => state.chainId,
    () => {
      useBlockchainStore.getState().getNativeBalance()
      useTokensStore.getState().syncBalances()
    },
  )

  useTokensStore.subscribe(
    (state) => state.tokens,
    () => {
      useTokensStore.getState().syncBalances()
    },
  )

  // Помимо такого обновления нам нужно обновляться на смену chainId
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
