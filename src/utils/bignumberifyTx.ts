import { BigNumber } from '@ethersproject/bignumber'
import { PopulatedTransaction } from '@ethersproject/contracts'

export const bignumberifyTx = (tx: Record<string, unknown>) => {
  return Object.fromEntries(
    Object.entries(tx).map(([key, value]) => {
      if (
        [
          'gasLimit',
          'gasPrice',
          'value',
          'maxFeePerGas',
          'maxPriorityFeePerGas',
        ].indexOf(key) !== -1 &&
        value
      ) {
        return [key, BigNumber.from(value)]
      }

      if (['nonce', 'chainId'].indexOf(key) !== -1 && value) {
        return [key, BigNumber.from(value).toNumber()]
      }

      return [key, value]
    }),
  ) as PopulatedTransaction
}
