import { useEffect, useState } from 'react'
import { PopulatedTransaction } from '@ethersproject/contracts'
import { useWallet } from './useWallet'

interface Estimate {
  loading: boolean
  error?: string
  gasLimit: string
}

export const useEstimate = (populatedTx: PopulatedTransaction) => {
  const wallet = useWallet()!
  const [estimate, setEstimate] = useState<Estimate>({
    loading: true,
    gasLimit: populatedTx.gasLimit?.toString() ?? '',
  })

  useEffect(() => {
    const call = async () => {
      setEstimate({
        loading: true,
        gasLimit: estimate.gasLimit,
      })

      try {
        const usedGas = await wallet.estimateGas(populatedTx)
        const fivePercent = usedGas.mul(5).div(100)
        const gasLimit = usedGas.add(fivePercent)

        setEstimate({
          loading: false,
          gasLimit: estimate.gasLimit || gasLimit.toString(),
        })
      } catch (err: any) {
        setEstimate({
          loading: false,
          error: `${err?.code}: ${err?.reason}`,
          gasLimit: estimate.gasLimit,
        })
      }
    }

    call()
  }, [populatedTx])

  return estimate
}
