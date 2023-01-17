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
            newBalances.set(token.address, currentBalance)
          }

          const contract = new Contract(token.address, ERC20_ABI, provider)
          const balance: Nullable<BigNumber> = await contract.callStatic
            .balanceOf(wallet.address)
            .catch(() => null)

          const value = (balance ? balance.toString() : currentBalance) ?? null

          newBalances.set(token.address, value)

          set({ balances: new Map(newBalances) })
        }),
    )
  }
