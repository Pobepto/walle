import { useEffect, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { PopulatedTransaction } from '@ethersproject/contracts'
import { ZERO } from '@src/constants'
import { useBlockchainStore } from '@src/store'

import { useAsync } from './useAsync'

interface GasData {
  maxFeePerGas: BigNumber
  maxPriorityFeePerGas: BigNumber
  gasPrice: BigNumber
}

export const useGasData = (populatedTx: PopulatedTransaction) => {
  const provider = useBlockchainStore((store) => store.provider)
  const [gasData, setGasData] = useState<GasData>({
    maxFeePerGas: populatedTx.maxFeePerGas ?? ZERO,
    maxPriorityFeePerGas: populatedTx.maxPriorityFeePerGas ?? ZERO,
    gasPrice: populatedTx.gasPrice ?? ZERO,
  })

  const { execute, isLoading } = useAsync(async () => {
    try {
      const loadedGasData = await provider.getFeeData()

      return {
        maxFeePerGas: loadedGasData.maxFeePerGas ?? gasData.maxFeePerGas,
        maxPriorityFeePerGas:
          loadedGasData.maxPriorityFeePerGas ?? gasData.maxPriorityFeePerGas,
        gasPrice: loadedGasData.gasPrice ?? gasData.gasPrice,
      }
    } catch {
      return gasData
    }
  })

  const call = () => {
    execute().then(setGasData)
  }

  useEffect(() => {
    if (gasData.gasPrice.gt(0)) return
    if (gasData.maxFeePerGas.gt(0) && gasData.maxPriorityFeePerGas.gt(0)) return

    call()
  }, [])

  return {
    data: gasData,
    loading: isLoading,
    call,
  }
}
