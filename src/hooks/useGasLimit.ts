import { PopulatedTransaction } from '@ethersproject/contracts'
import { useEffect, useState } from 'react'
import { useWallet } from './useWallet'

export const useGasLimit = (populatedTx: PopulatedTransaction) => {
  const wallet = useWallet()
  const [isLoading, setLoading] = useState(true)
  const [estimatedGas, setEstimatedGas] = useState<string>('')

  if (!wallet) {
    throw new Error('Wallet is null!')
  }

  useEffect(() => {
    const estimate = async () => {
      setLoading(true)
      const gas = await wallet.estimateGas(populatedTx)
      setLoading(false)
      const fivePercent = gas.mul(5).div(100)

      setEstimatedGas(gas.add(fivePercent).toString())
    }

    estimate()
  }, [populatedTx])

  return [estimatedGas, isLoading] as const
}
