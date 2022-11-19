import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { useBlockchainStore } from '@src/store/blockchain'
import { ERC20_ABI } from '@src/store/blockchain/interfaces'
import { getWallet } from '@src/store/wallet'
import { TokensAction } from '..'

export const syncBalances: TokensAction<'syncBalances'> =
  (set, get) => async () => {
    const { provider, chainId } = useBlockchainStore.getState()
    const { tokens } = get()
    const wallet = getWallet()
    const balances = new Map()

    set({ balancesIsLoading: true })

    await Promise.all(
      tokens
        .filter((token) => token.chainId === chainId)
        .map(async (token) => {
          const contract = new Contract(token.address, ERC20_ABI, provider)
          const balance: BigNumber = await contract.callStatic
            .balanceOf(wallet.address)
            .catch(() => '🤔')

          balances.set(token.address, balance.toString())
        }),
    )

    set({ balances, balancesIsLoading: false })
  }
