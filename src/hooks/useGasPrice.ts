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
  isSupportEIP1599: boolean
}

export const useGasData = (populatedTx: PopulatedTransaction) => {
  const provider = useBlockchainStore((store) => store.provider)
  const [gasData, setGasData] = useState<GasData>({
    maxFeePerGas: populatedTx.maxFeePerGas ?? ZERO,
    maxPriorityFeePerGas: populatedTx.maxPriorityFeePerGas ?? ZERO,
    gasPrice: populatedTx.gasPrice ?? ZERO,
    isSupportEIP1599: false,
  })

  const { execute, isLoading } = useAsync(async () => {
    try {
      const fee = await provider.getFeeData()

      return {
        maxFeePerGas: fee.maxFeePerGas ?? gasData.maxFeePerGas,
        maxPriorityFeePerGas:
          fee.maxPriorityFeePerGas ?? gasData.maxPriorityFeePerGas,
        gasPrice: fee.gasPrice ?? gasData.gasPrice,
        isSupportEIP1599: Boolean(fee.maxFeePerGas && fee.maxFeePerGas.gt(0)),
      }
    } catch {
      return gasData
    }
  })

  const loadGasData = () => {
    execute().then(setGasData)
  }

  useEffect(() => {
    if (
      gasData.gasPrice.gt(0) ||
      (gasData.maxFeePerGas.gt(0) && gasData.maxPriorityFeePerGas.gt(0))
    ) {
      provider.getFeeData().then((fee) => {
        setGasData({
          ...gasData,
          isSupportEIP1599: Boolean(fee.maxFeePerGas && fee.maxFeePerGas.gt(0)),
        })
      })
    } else {
      loadGasData()
    }
  }, [])

  return {
    data: gasData,
    loading: isLoading,
    load: loadGasData,
  }
}
