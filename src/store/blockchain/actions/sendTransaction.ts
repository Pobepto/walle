import { BlockchainAction } from '..'

export const sendTransaction: BlockchainAction<'sendTransaction'> =
  (set, get) => async (populatedTx) => {
    const { getSigner } = get()
    const signer = getSigner()

    const tx = await signer.sendTransaction(populatedTx)
    const result = await tx.wait()

    return result
  }
