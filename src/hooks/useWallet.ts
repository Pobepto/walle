import { Wallet } from '@ethersproject/wallet'
import { Nullable } from 'tsdef'
import { useAccountStore } from '../store'

export const useWallet = (): Nullable<Wallet> => {
  const phrase = useAccountStore(state => state.phrase)

  try {
    return Wallet.fromMnemonic(phrase)
  } catch {
    return null
  }
}
