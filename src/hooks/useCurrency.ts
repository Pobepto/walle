import { useTokensStore } from '@src/store'
import { useBlockchainStore } from '@store/blockchain'

export const useCurrency = () => {
  const chainId = useBlockchainStore((store) => store.chainId)
  const currencies = useTokensStore((store) => store.currencies)

  const currency = currencies.find((currency) => currency.chainId === chainId)

  if (!currency) {
    throw new Error('useCurrency: currency not found in currencies')
  }

  return currency
}
