import { PreparedTransactionRequest } from 'ethers'

export const bigintifyTx = (
  tx: Record<string, string | number>,
): PreparedTransactionRequest => {
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
        return [key, BigInt(value)]
      }

      if (['nonce', 'chainId'].indexOf(key) !== -1 && value) {
        return [key, Number(BigInt(value))]
      }

      return [key, value]
    }),
  )
}
