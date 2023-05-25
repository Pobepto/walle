import { useMemo } from 'react'
import { Contract, InterfaceAbi } from 'ethers'

import { useBlockchainStore } from '@src/store'

export const useContract = (address: string, abi: InterfaceAbi) => {
  const provider = useBlockchainStore((store) => store.provider)

  return useMemo(
    () => new Contract(address, abi, provider),
    [address, abi, provider],
  )
}
