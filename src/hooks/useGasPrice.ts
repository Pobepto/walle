import { useBlockchainStore } from '@src/store'
import { useEffect, useState } from 'react'
import { useAsync } from './useAsync'

export const useGasPrice = () => {
  const provider = useBlockchainStore((store) => store.provider)
  const [price, setPrice] = useState('')

  const { execute, isLoading } = useAsync(() => {
    return provider
      .getGasPrice()
      .then((gasPrice) => gasPrice.toString())
      .catch(() => '0')
  })

  useEffect(() => {
    execute().then(setPrice)
  }, [])

  return [price, isLoading] as const
}
