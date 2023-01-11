import React, { useState } from 'react'
import { Box, Text } from 'ink'
import { Button, Error } from '@components'
import { useSelection } from '@hooks'
import { COLUMNS, useWalletConnectStore } from '@store'
import { useSelectionZone } from '@src/components/SelectionZone'
import { Loader } from '@src/components/Loader'
import { ROUTE, useNavigate, useRouteData } from '@src/routes'
import { MaybePromise } from 'tsdef'

export const WalletConnectProposal: React.FC = () => {
  const parentZone = useSelectionZone()!
  const navigate = useNavigate()

  const approve = useWalletConnectStore((store) => store.approve)
  const reject = useWalletConnectStore((store) => store.reject)

  const { proposal } = useRouteData<ROUTE.WALLET_CONNECT_PROPOSAL>()
  const {
    params: { proposer, requiredNamespaces },
  } = proposal
  const { metadata } = proposer

  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [selection] = useSelection({
    amount: 2,
    prevKey: 'upArrow',
    nextKey: ['downArrow', 'return'],
    isActive: parentZone.selection === COLUMNS.MAIN,
  })

  const safeCall = async (call: () => MaybePromise<any>) => {
    try {
      setLoading(true)
      await call()
    } catch (err: unknown) {
      setError(err?.toString() ?? 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const onReject = async () => {
    await reject(proposal)
    navigate(ROUTE.WALLET_CONNECT, {})
  }

  const onApprove = async () => {
    await approve(proposal)
    navigate(ROUTE.WALLET_CONNECT, {})
  }

  return (
    <Box flexDirection="column">
      <Box marginTop={-1}>
        <Text> Connect to WalletConnect </Text>
      </Box>
      <Text>
        {metadata.name} {metadata.url}
      </Text>
      <Box marginTop={1}>
        <Text bold>Review permissions</Text>
      </Box>
      {Object.entries(requiredNamespaces).map(([chain, namespace]) => {
        const { chains, events, methods } = namespace
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
                .map((chainId) => chainId.replace(`${chain}:`, ''))
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
        onPress={() => safeCall(onReject)}
      >
        Reject
      </Button>
      <Button
        isFocused={parentZone.selection === COLUMNS.MAIN && selection === 1}
        isDisabled={isLoading}
        onPress={() => safeCall(onApprove)}
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
