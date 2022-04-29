import React, { useEffect, useState } from 'react'
import { Box, Text } from 'ink'
import { useWallet } from '../hooks/useWallet'
import { useBlockchainStore } from '../store/blockchain'
import { useProvider } from '../hooks/useProvider'

export const Header: React.FC = () => {
  const [balance, setBalance] = useState('')
  const wallet = useWallet()
  const chainId = useBlockchainStore(store => store.chainId)
  const provider = useProvider(chainId)

  useEffect(() => {
    if (wallet) {
      provider.getBalance(wallet.address).then(balance => {
        setBalance(balance.toString())
      })
    }
  }, [chainId, wallet])

  return (
    <Box flexDirection="column" borderStyle="classic" borderColor="cyan">
      <Text>ChainId: {chainId}</Text>
      <Text>Account: {wallet?.address}</Text>
      <Text>Balance: {balance ?? '???'}</Text>
    </Box>
  )
}
