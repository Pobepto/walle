import React, { useEffect, useState } from 'react'
import { Box, Text } from 'ink'
import { Button, Error } from '@components'
import { useForm, useSelection, walletConnectLink } from '@hooks'
import { InputBox } from '@components/InputBox'
import { COLUMNS, useWalletConnectStore } from '@store'
import { useSelectionZone } from '@src/components/SelectionZone'
import { Loader } from '@src/components/Loader'
import { ROUTE, useNavigate, useRouteData } from '@src/routes'
import { signClient } from '@src/wallet-connect'

type Inputs = {
  uri: string
}

export const WalletConnect: React.FC = () => {
  const parentZone = useSelectionZone()!
  const navigate = useNavigate()

  const connect = useWalletConnectStore((store) => store.connect)
  const disconnect = useWalletConnectStore((store) => store.disconnect)
  const connected = useWalletConnectStore((store) => store.connected())

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

  const onDisconnect = async (topic: string) => {
    await disconnect(topic)
    navigate(ROUTE.WALLET)
  }

  useEffect(() => {
    if (uri) {
      safeCall(onConnect)
    }
  }, [])

  if (connected) {
    const session = signClient.session.values[0]
    const {
      topic,
      peer: { metadata },
    } = session

    return (
      <Box flexDirection="column">
        <Box marginTop={-1}>
          <Text> Active session </Text>
        </Box>
        <Box flexDirection="column" borderStyle="classic" paddingX={1}>
          <Box marginTop={-1}>
            <Text> Connected to </Text>
          </Box>
          <Text bold>{metadata.name}</Text>
          <Text color="cyan">{metadata.url}</Text>
          <Text>{metadata.description}</Text>
        </Box>
        <Button
          isFocused={parentZone.selection === COLUMNS.MAIN}
          onPress={() => safeCall(() => onDisconnect(topic))}
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
