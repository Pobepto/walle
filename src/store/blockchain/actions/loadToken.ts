import { Contract } from '@ethersproject/contracts'

import { ERC20_ABI } from '../interfaces'
import { BlockchainAction } from '..'

export const loadToken: BlockchainAction<'loadToken'> =
  (set, get) => async (address) => {
    const { provider } = get()
    const contract = new Contract(address, ERC20_ABI, provider)

    try {
      const [name, symbol, decimals]: [string, string, number] =
        await Promise.all([
          contract.callStatic.name(),
          contract.callStatic.symbol(),
          contract.callStatic.decimals(),
        ])

      return { name, symbol, decimals }
    } catch {
      throw new Error("Can't load information about this token")
    }
  }
