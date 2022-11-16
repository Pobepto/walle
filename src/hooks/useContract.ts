import { Contract, ContractInterface } from '@ethersproject/contracts'
import { useMemo } from 'react'

export const useContract = (address: string, abi: ContractInterface) => {
  return useMemo(() => new Contract(address, abi), [address, abi])
}
