import { Contract, ContractInterface } from '@ethersproject/contracts'
import { useState } from 'react'

export const useContract = (address: string, abi: ContractInterface) => {
  const [contract] = useState<Contract>(() => new Contract(address, abi))

  return contract
}
