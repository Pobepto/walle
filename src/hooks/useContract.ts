import { useMemo } from 'react'
import { Contract, ContractRunner, InterfaceAbi } from 'ethers'

export const useContract = (
  address: string,
  abi: InterfaceAbi,
  provider?: ContractRunner,
) => {
  return useMemo(
    () => new Contract(address, abi, provider),
    [address, abi, provider],
  )
}
