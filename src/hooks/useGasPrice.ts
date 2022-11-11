import { useBlockchainStore } from '@src/store'
import { useEffect, useState } from 'react'

export const useGasPrice = () => {
  const provider = useBlockchainStore((store) => store.provider)
  const [isLoading, setLoading] = useState(true)
  const [price, setPrice] = useState<string>('0')

  useEffect(() => {
    const getPrice = async () => {
      setLoading(true)
      const currentPrice = await provider.getGasPrice()
      setLoading(false)

      setPrice(currentPrice.toString())
    }

    getPrice()
  }, [])

  return [price, isLoading] as const
}
