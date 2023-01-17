import { BlockchainAction } from '..'

export const sendTransaction: BlockchainAction<'sendTransaction'> =
  (set, get) => async (populatedTx) => {
    const { getSigner } = get()
    const signer = getSigner()

    set({ txInProgress: true })

    try {
      const tx = await signer.sendTransaction(populatedTx)
      const result = await tx.wait()

      set({ txInProgress: false })

      return result
    } catch (err) {
      set({ txInProgress: false })
    }
  }
