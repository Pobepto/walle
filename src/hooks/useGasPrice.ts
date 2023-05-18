import { useEffect, useState } from 'react'
import { PreparedTransactionRequest } from 'ethers'

import { useBlockchainStore } from '@src/store'

import { useAsync } from './useAsync'

interface GasData {
  maxFeePerGas: bigint
  maxPriorityFeePerGas: bigint
  gasPrice: bigint
  isSupportEIP1599: boolean
}

export const useGasData = (populatedTx: PreparedTransactionRequest) => {
  const provider = useBlockchainStore((store) => store.provider)
  const [gasData, setGasData] = useState<GasData>({
    maxFeePerGas: populatedTx.maxFeePerGas ?? 0n,
    maxPriorityFeePerGas: populatedTx.maxPriorityFeePerGas ?? 0n,
    gasPrice: populatedTx.gasPrice ?? 0n,
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
        isSupportEIP1599: Boolean(fee.maxFeePerGas && fee.maxFeePerGas > 0),
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
      gasData.gasPrice > 0n ||
      (gasData.maxFeePerGas > 0n && gasData.maxPriorityFeePerGas > 0n)
    ) {
      provider.getFeeData().then((fee) => {
        setGasData({
          ...gasData,
          isSupportEIP1599: Boolean(fee.maxFeePerGas && fee.maxFeePerGas > 0n),
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
