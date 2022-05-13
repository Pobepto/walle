import { useBlockchainStore } from '../store/blockchain'

export const useNativeBalance = () => {
  const balance = useBlockchainStore(store => store.nativeBalance)
  const isLoading = useBlockchainStore(store => store.nativeBalanceIsLoading)

  return [balance, isLoading]
}
