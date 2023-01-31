import { useEffect, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { ZERO } from '@src/constants'
import { useBlockchainStore } from '@src/store'

import { useAsync } from './useAsync'

export const useGasPrice = (suggestedGasPrice?: BigNumber) => {
  const provider = useBlockchainStore((store) => store.provider)
  const [price, setPrice] = useState(suggestedGasPrice ?? ZERO)

  const { execute, isLoading } = useAsync(() => {
    return provider.getGasPrice().catch(() => ZERO)
  })

  useEffect(() => {
    if (price.eq(0)) {
      execute().then(setPrice)
    }
  }, [])

  return [price, isLoading] as const
}

// export const useGasData = (populatedTx: PopulatedTransaction) => {
//   const provider = useBlockchainStore((store) => store.provider)
//   const [gasData, setGasData] = useState<Omit<FeeData, 'lastBaseFeePerGas'>>({
//     maxFeePerGas: BigNumber.from(populatedTx.maxFeePerGas ?? 0),
//     maxPriorityFeePerGas: BigNumber.from(populatedTx.maxPriorityFeePerGas ?? 0),
//     gasPrice: BigNumber.from(populatedTx.gasPrice ?? 0),
//   })

//   const { execute, isLoading } = useAsync(() => {
//     return provider.getFeeData().catch(() => ({}))
//   })

//   useEffect(() => {
//     // if (price.eq(0)) {
//     //   execute().then(setPrice)
//     // }
//   }, [])

//   return [gasData, isLoading] as const
// }
