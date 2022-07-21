import { PopulatedTransaction } from '@ethersproject/contracts'
import { useEffect, useState } from 'react'
import { useWallet } from './useWallet'

export const useEstimate = (populatedTx: PopulatedTransaction) => {
  const wallet = useWallet()

  if (!wallet) {
    throw new Error('Wallet is null!')
  }

  const [estimatedGas, setEstimatedGas] = useState<string>('0')

  useEffect(() => {
    const estimate = async () => {
      const gas = await wallet.estimateGas(populatedTx)

      setEstimatedGas(gas.toString())
    }

    estimate()
  }, [populatedTx])

  return estimatedGas
}
