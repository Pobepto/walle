import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { useBlockchainStore } from '@src/store/blockchain'
import { ERC20_ABI } from '@src/store/blockchain/interfaces'
import { useWalletStore } from '@src/store/wallet'
import { Nullable } from 'tsdef'
import { TokensAction } from '..'

export const loadBalances: TokensAction<'loadBalances'> =
  (set, get) => async () => {
    const { provider, chainId } = useBlockchainStore.getState()
    const { getWallet } = useWalletStore.getState()
    const { tokens, balances } = get()

    const wallet = getWallet()

    const newBalances = new Map(balances)

    await Promise.all(
      tokens
        .filter((token) => token.chainId === chainId)
        .map(async (token) => {
          const currentBalance = newBalances.get(token.address)
          if (currentBalance) {
            newBalances.set(token.address, {
              ...currentBalance,
              isLoading: true,
            })
          }

          const contract = new Contract(token.address, ERC20_ABI, provider)
          const balance: Nullable<BigNumber> = await contract.callStatic
            .balanceOf(wallet.address)
            .catch(() => null)

          if (balance) {
            newBalances.set(token.address, {
              value: balance.toString(),
              isLoading: false,
            })
          } else if (currentBalance) {
            newBalances.set(token.address, {
              ...currentBalance,
              isLoading: false,
            })
          } else {
            newBalances.set(token.address, {
              value: null,
              isLoading: false,
            })
          }

          set({ balances: new Map(newBalances) })
        }),
    )
  }
