import { PopulatedTransaction } from '@ethersproject/contracts'
import { Wallet } from '@ethersproject/wallet'
import { useWalletStore } from '@src/store/wallet'
import { getDerivationPath } from '@src/utils'
import { BlockchainAction } from '..'

export const sendTransaction: BlockchainAction<'sendTransaction'> =
  (set) =>
  async (populatedTx: PopulatedTransaction): Promise<void> => {
    set({ txInProgress: true })
    const { phrase, pathId } = useWalletStore.getState()

    if (!phrase) return

    try {
      const wallet = Wallet.fromMnemonic(phrase, getDerivationPath(pathId))
      await wallet.sendTransaction(populatedTx)

      set({ txInProgress: false })
    } catch (err) {
      set({ txInProgress: false })
    }
  }
