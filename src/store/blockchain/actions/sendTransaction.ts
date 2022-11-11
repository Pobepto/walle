import { PopulatedTransaction } from '@ethersproject/contracts'
import { getSigner } from '@src/store/wallet'
import { BlockchainAction } from '..'

export const sendTransaction: BlockchainAction<'sendTransaction'> =
  (set) =>
  async (populatedTx: PopulatedTransaction): Promise<void> => {
    const signer = getSigner()

    set({ txInProgress: true })

    try {
      const tx = await signer.sendTransaction(populatedTx)
      const result = await tx.wait()

      set({ txInProgress: false })
    } catch (err) {
      console.log(err)
      set({ txInProgress: false })
    }
  }
