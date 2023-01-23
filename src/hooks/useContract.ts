import { useMemo } from 'react'

import { Signer } from '@ethersproject/abstract-signer'
import { Contract, ContractInterface } from '@ethersproject/contracts'
import { Provider } from '@ethersproject/providers'

export const useContract = (
  address: string,
  abi: ContractInterface,
  provider?: Signer | Provider,
) => {
  return useMemo(
    () => new Contract(address, abi, provider),
    [address, abi, provider],
  )
}
