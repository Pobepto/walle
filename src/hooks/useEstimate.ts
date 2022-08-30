import { PopulatedTransaction } from '@ethersproject/contracts'
import { useEffect, useState } from 'react'
import { useWallet } from './useWallet'

export const useEstimate = (populatedTx: PopulatedTransaction) => {
  const wallet = useWallet()
  const [estimatedGas, setEstimatedGas] = useState<string>('0')

  if (!wallet) {
    throw new Error('Wallet is null!')
  }

  useEffect(() => {
    const estimate = async () => {
      const gas = await wallet.estimateGas(populatedTx)

      setEstimatedGas(gas.toString())
    }

    estimate()
  }, [populatedTx])

  return estimatedGas
}
