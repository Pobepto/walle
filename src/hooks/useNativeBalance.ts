import { useEffect, useState } from 'react'
import { useChain } from './useChain'
import { useWallet } from './useWallet'

export const useNativeBalance = (chainId: number) => {
  const [balance, setBalance] = useState('')
  const wallet = useWallet()
  const chain = useChain(chainId)

  useEffect(() => {
    if (wallet) {
      chain.provider.getBalance(wallet.address).then(balance => {
        setBalance(balance.toString())
      })
    }
  }, [chain, wallet])

  return balance
}
