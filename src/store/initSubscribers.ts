import { useBlockchainStore } from './blockchain'
import { useTokensStore } from './tokens'
import { useWalletStore } from './wallet'

const updateBalance = async () => {
  await Promise.all([
    useBlockchainStore.getState().getNativeBalance(),
    useTokensStore.getState().loadBalances(),
  ])

  setTimeout(updateBalance, 5_000)
}

export const initSubscribers = () => {
  setTimeout(updateBalance, 5_000)

  useBlockchainStore.subscribe(
    (state) => state.chainId,
    () => {
      useBlockchainStore.getState().updateProvider()
      useBlockchainStore.getState().getNativeBalance()
      useTokensStore.getState().loadBalances()
    },
    {
      fireImmediately: true,
    },
  )

  useTokensStore.subscribe(
    (state) => state.tokens,
    () => {
      useTokensStore.getState().loadBalances()
    },
  )

  useWalletStore.subscribe(
    (state) => [state.pathId, state.phrase],
    ([, phrase]) => {
      if (phrase) {
        useBlockchainStore.getState().getNativeBalance()
        useTokensStore.getState().loadBalances()
      }
    },
  )
}
