import React, { useState } from 'react'
import { Box, Text } from 'ink'
import { Button, Error } from '@components'
import { useForm, useSelection, walletConnectLink } from '@hooks'
import { InputBox } from '@components/InputBox'
import { COLUMNS, useWalletConnectStore } from '@store'
import { useSelectionZone } from '@src/components/SelectionZone'
import { Loader } from '@src/components/Loader'

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

  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { errors, data, isValid, register } = useForm<Inputs>({
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

  const onConnect = async () => {
    try {
      setLoading(true)
      await connect(data.uri)
      select(0)
    } catch (err: any) {
      setError(err.toString())
    } finally {
      setLoading(false)
    }
  }

  if (connected && proposal) {
    const { proposer } = proposal.params

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
        {Object.entries(requiredNamespaces).map(([chainKey, namespace]) => {
          const { chains, events, methods } = namespace
          return (
            <Box marginY={1} key={chainKey} flexDirection="column">
              <Text bold>{chainKey}</Text>
              <Text>Chains: {chains.join(', ')}</Text>
              <Text>Events: {events.join(', ')}</Text>
              <Text>Methods: {methods.join(', ')}</Text>
            </Box>
          )
        })}
        <Button isFocused={selection === 0} onPress={disconnect}>
          Reject
        </Button>
        <Button isFocused={selection === 1} onPress={approve}>
          Approve
        </Button>
      </Box>
    )
  }

  return (
    <Box flexDirection="column">
      <Box marginTop={-1}>
        <Text> Connect to WalletConnect </Text>
      </Box>
      <InputBox
        label="WalletConnect URI"
        error={errors.uri}
        focus={selection === 0}
        disabled={isLoading}
        {...register('uri')}
      />
      <Button
        isFocused={selection === 1}
        onPress={onConnect}
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
