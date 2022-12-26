import React, { useEffect, useState } from 'react'
import { Box, Text } from 'ink'
import { Button, Error } from '@components'
import { useForm, useSelection, walletConnectLink } from '@hooks'
import { InputBox } from '@components/InputBox'
import { COLUMNS, useWalletConnectStore } from '@store'
import { useSelectionZone } from '@src/components/SelectionZone'
import { Loader } from '@src/components/Loader'
import { ROUTE, useRouteData } from '@src/routes'

type Inputs = {
  uri: string
}

export const WalletConnect: React.FC = () => {
  const parentZone = useSelectionZone()!
  const connect = useWalletConnectStore((store) => store.connect)
  const approve = useWalletConnectStore((store) => store.approve)
  const disconnect = useWalletConnectStore((store) => store.disconnect)
  const proposal = useWalletConnectStore((store) => store.proposal)
  const connected = useWalletConnectStore((store) => store.connected)

  const { uri } = useRouteData<ROUTE.WALLET_CONNECT>() ?? {}

  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { errors, data, isValid, register } = useForm<Inputs>({
    initialValues: {
      uri: uri ?? '',
    },
    rules: {
      uri: walletConnectLink(),
    },
  })

  const [selection, select] = useSelection({
    amount: 2,
    prevKey: 'upArrow',
    nextKey: ['downArrow', 'return'],
    isActive: parentZone.selection === COLUMNS.MAIN,
  })

  const safeCall = async (call: () => Promise<any>) => {
    try {
      setLoading(true)
      await call()
    } catch (err: unknown) {
      setError(err?.toString() ?? 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const onConnect = async () => {
    await connect(data.uri)
    select(0)
  }

  useEffect(() => {
    if (uri) {
      safeCall(onConnect)
    }
  }, [])

  if (connected) {
    const { proposer } = proposal!.params

    return (
      <Box flexDirection="column">
        <Box marginTop={-1}>
          <Text> Active session </Text>
        </Box>
        <Text>
          Connected to {proposer.metadata.name} {proposer.metadata.url}
        </Text>
        <Button
          isFocused={parentZone.selection === COLUMNS.MAIN}
          onPress={disconnect}
        >
          Disconnect
        </Button>
        <Box justifyContent="center">
          <Loader loading={isLoading}>
            <Error text={error} />
          </Loader>
        </Box>
      </Box>
    )
  }

  if (proposal) {
    const { proposer, requiredNamespaces } = proposal.params

    return (
      <Box flexDirection="column">
        <Box marginTop={-1}>
          <Text> Connect to WalletConnect </Text>
        </Box>
        <Text>
          {proposer.metadata.name} {proposer.metadata.url}
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
          onPress={() => safeCall(disconnect)}
        >
          Reject
        </Button>
        <Button
          isFocused={parentZone.selection === COLUMNS.MAIN && selection === 1}
          isDisabled={isLoading}
          onPress={() => safeCall(approve)}
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

  return (
    <Box flexDirection="column">
      <Box marginTop={-1}>
        <Text> Connect to WalletConnect </Text>
      </Box>
      <InputBox
        label="WalletConnect v2 URI"
        error={errors.uri}
        focus={parentZone.selection === COLUMNS.MAIN && selection === 0}
        disabled={isLoading}
        placeholder="e.g. wc:48585f62..."
        {...register('uri')}
      />
      <Button
        isFocused={parentZone.selection === COLUMNS.MAIN && selection === 1}
        onPress={() => safeCall(onConnect)}
        isDisabled={!isValid}
      >
        Connect
      </Button>
      <Box justifyContent="center">
        <Loader loading={isLoading}>
          <Error text={error} />
        </Loader>
      </Box>
    </Box>
  )
}
