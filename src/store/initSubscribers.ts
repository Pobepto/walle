import { useBlockchainStore } from './blockchain'
import { useTokensStore } from './tokens'
import { useWalletStore } from './wallet'

let isInited = false

const updateBalance = async () => {
  try {
    await Promise.all([
      useBlockchainStore.getState().getNativeBalance(),
      useTokensStore.getState().loadBalances(),
    ])
  } catch {
    //
  }

  setTimeout(updateBalance, 5_000)
}

export const initSubscribers = () => {
  if (isInited) {
    return
  }

  isInited = true
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
    (state) => [
      state.accountIndex,
      state.addressIndex,
      state.mnemonicOrPrivateKey,
    ],
    ([, mnemonicOrPrivateKey]) => {
      if (mnemonicOrPrivateKey) {
        useBlockchainStore.getState().getNativeBalance()
        useTokensStore.getState().loadBalances()
      }
    },
  )
}
