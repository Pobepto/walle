import { useChain } from './useChain'

export const useCurrency = () => {
  return useChain().currency
}
