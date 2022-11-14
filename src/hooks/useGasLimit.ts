import { useEffect, useState } from 'react'
import { PopulatedTransaction } from '@ethersproject/contracts'
import { useWallet } from './useWallet'

export const useGasLimit = (populatedTx: PopulatedTransaction) => {
  const wallet = useWallet()!
  const [isLoading, setLoading] = useState(true)
  const [gasLimit, setGasLimit] = useState('')

  useEffect(() => {
    const estimate = async () => {
      setLoading(true)
      const gas = await wallet.estimateGas(populatedTx)
      setLoading(false)
      const fivePercent = gas.mul(5).div(100)

      setGasLimit(gas.add(fivePercent).toString())
    }

    estimate()
  }, [populatedTx])

  return [gasLimit, isLoading] as const
}
