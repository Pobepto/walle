import { useEffect, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { PopulatedTransaction } from '@ethersproject/contracts'
import { ZERO } from '@src/constants'

import { useWallet } from './useWallet'

interface Estimate {
  loading: boolean
  error?: string
  gasLimit: BigNumber
}

export const useEstimate = (populatedTx: PopulatedTransaction) => {
  const wallet = useWallet()
  const [estimate, setEstimate] = useState<Estimate>({
    loading: false,
    gasLimit: populatedTx.gasLimit ?? ZERO,
  })

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
    if (estimate.gasLimit.eq(0)) {
      call()
    }
  }, [populatedTx])

  return {
    ...estimate,
    call,
  }
}
