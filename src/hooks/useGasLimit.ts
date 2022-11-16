import { useEffect, useState } from 'react'
import { PopulatedTransaction } from '@ethersproject/contracts'
import { useWallet } from './useWallet'
import { BigNumber } from '@ethersproject/bignumber'

export const useGasLimit = (populatedTx: PopulatedTransaction) => {
  const wallet = useWallet()!
  const [isLoading, setLoading] = useState(true)
  const [gasLimit, setGasLimit] = useState('')

  useEffect(() => {
    const estimate = async () => {
      setLoading(true)
      const gas = await wallet
        .estimateGas(populatedTx)
        .catch(() => BigNumber.from(0))
      setLoading(false)
      const fivePercent = gas.mul(5).div(100)

      setGasLimit(gas.add(fivePercent).toString())
    }

    estimate()
  }, [populatedTx])

  return [gasLimit, isLoading] as const
}
