import { Wallet } from '@ethersproject/wallet'
import { useWalletStore } from '@src/store'
import { Currency, Token } from '@src/store/tokens'
import { getDerivationPath } from '@utils'
import { BlockchainAction } from '..'
import { ERC20 } from '../contract'

export const transfer: BlockchainAction<'transfer'> =
  (set) =>
  async (recipient: string, token: Token, amount: string): Promise<void> => {
    set({ transferInProgress: true })
    const { phrase, pathId } = useWalletStore.getState()

    if (!phrase) return

    try {
      const wallet = Wallet.fromMnemonic(phrase, getDerivationPath(pathId))
      const contract = ERC20(token.address, wallet)

      await contract.transfer(amount, recipient)

      set({ transferInProgress: false })
    } catch (err) {
      set({ transferInProgress: false })
    }
  }
