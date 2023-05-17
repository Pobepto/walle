import { useEffect, useState } from 'react'
import { PreparedTransactionRequest } from 'ethers'

import { useWallet } from './useWallet'

interface Estimate {
  loading: boolean
  error?: string
  gasLimit: bigint
}

export const useEstimate = (populatedTx: PreparedTransactionRequest) => {
  const wallet = useWallet()
  const [estimate, setEstimate] = useState<Estimate>({
    loading: false,
    gasLimit: populatedTx.gasLimit ?? 0n,
  })

  const call = async () => {
    setEstimate({
      loading: true,
      gasLimit: estimate.gasLimit,
    })

    try {
      const usedGas = await wallet.estimateGas(populatedTx)
      const fivePercent = (usedGas * 5n) / 100n
      const gasLimit = usedGas + fivePercent

      setEstimate({
        loading: false,
        gasLimit,
      })
    } catch (err: any) {
      setEstimate({
        loading: false,
        error: `${err?.code}: ${err?.reason}`,
        gasLimit: estimate.gasLimit,
      })
    }
  }

  useEffect(() => {
    if (estimate.gasLimit === 0n) {
      call()
    }
  }, [populatedTx])

  return {
    ...estimate,
    call,
  }
}
