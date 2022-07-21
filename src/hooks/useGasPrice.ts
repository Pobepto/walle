import { useBlockchainStore } from '@src/store'
import { useEffect, useState } from 'react'

export const useGasPrice = () => {
  const provider = useBlockchainStore((store) => store.provider)
  const [price, setPrice] = useState<string>('0')

  useEffect(() => {
    const getPrice = async () => {
      const currentPrice = await provider.getGasPrice()

      setPrice(currentPrice.toString())
    }

    getPrice()
  }, [])

  return price
}
