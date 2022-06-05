import { useTokensStore } from '@src/store'
import { useBlockchainStore } from '@store/blockchain'

export const useCurrency = () => {
  const chainId = useBlockchainStore((store) => store.chainId)
  const currencies = useTokensStore((store) => store.currencies)

  return currencies.find((currency) => currency.chainId === chainId)!
}
