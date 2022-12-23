import { getSigner } from '@src/store/wallet'
import { BlockchainAction } from '..'

export const sendTransaction: BlockchainAction<'sendTransaction'> =
  (set) => async (populatedTx) => {
    const signer = getSigner()

    set({ txInProgress: true })

    try {
      const tx = await signer.sendTransaction(populatedTx)
      const result = await tx.wait()

      set({ txInProgress: false })

      return result
    } catch (err) {
      console.log(err)
      set({ txInProgress: false })
    }
  }
