import React from 'react'
import { Box, Text } from 'ink'

import { Button, Error } from '@components'
import { useSelection } from '@hooks'
import { Loader } from '@src/components/Loader'
import { useSelectionZone } from '@src/components/SelectionZone'
import { COLUMNS } from '@src/constants'
import { useAsync } from '@src/hooks/useAsync'
import { ROUTE, useNavigate, useRouteData } from '@src/routes'
import { useBlockchainStore, useWalletConnectStore } from '@store'

export const WalletConnectProposal: React.FC = () => {
  const parentZone = useSelectionZone()!
  const navigate = useNavigate()

  const approve = useWalletConnectStore((store) => store.approve)
  const reject = useWalletConnectStore((store) => store.reject)
  const addedChains = useBlockchainStore((store) => store.chains)

  const { proposal } = useRouteData<ROUTE.WALLET_CONNECT_PROPOSAL>()
  const {
    params: { proposer, requiredNamespaces },
  } = proposal
  const { metadata } = proposer

  const { safeExecute, isLoading, error } = useAsync(
    (call: () => Promise<any>) => {
      return call()
    },
  )

  const { selection } = useSelection({
    amount: 2,
    prevKey: 'upArrow',
    nextKey: ['downArrow', 'return'],
    isActive: parentZone.selection === COLUMNS.MAIN,
  })

  const onReject = () => {
    safeExecute(async () => {
      await reject(proposal)
      navigate(ROUTE.WALLET_CONNECT, {})
    })
  }

  const onApprove = () => {
    safeExecute(async () => {
      await approve(proposal)
      navigate(ROUTE.WALLET_CONNECT, {})
    })
  }

  return (
    <Box flexDirection="column">
      <Box marginTop={-1}>
        <Text bold> Connect to WalletConnect </Text>
      </Box>
      <Text>
        {metadata.name} {metadata.url}
      </Text>
      <Box marginTop={1}>
        <Text bold>Review permissions</Text>
      </Box>
      {Object.entries(requiredNamespaces).map(([chain, namespace]) => {
        const { chains = [], events, methods } = namespace
        return (
          <Box
            marginY={1}
            key={chain}
            flexDirection="column"
            paddingX={1}
            borderStyle="classic"
          >
            <Box marginTop={-1}>
              <Text bold>{chain}</Text>
            </Box>
            <Text>
              Chains:{' '}
              {chains
                .map((chainWithId) => {
                  const [, chainId] = chainWithId.split(':')
                  const chainInfo = addedChains.find(
                    (c) => c.chainId === parseInt(chainId),
                  )

                  return chainInfo ? chainInfo.name : chainId
                })
                .join(', ')}
            </Text>
            {events.length ? <Text>Events: {events.join(', ')}</Text> : null}
            <Text>Methods: {methods.join(', ')}</Text>
          </Box>
        )
      })}
      <Button
        isFocused={parentZone.selection === COLUMNS.MAIN && selection === 0}
        isDisabled={isLoading}
        onPress={onReject}
      >
        Reject
      </Button>
      <Button
        isFocused={parentZone.selection === COLUMNS.MAIN && selection === 1}
        isDisabled={isLoading}
        onPress={onApprove}
      >
        Approve
      </Button>
      <Box justifyContent="center">
        <Loader loading={isLoading}>
          <Error text={error} />
        </Loader>
      </Box>
    </Box>
  )
}
