import React, { useEffect } from 'react'
import { Box, Text } from 'ink'

import { Button, Error } from '@components'
import { InputBox } from '@components/InputBox'
import { useForm, useSelection, walletConnectLink } from '@hooks'
import { Loader } from '@src/components/Loader'
import { useSelectionZone } from '@src/components/SelectionZone'
import { useAsync } from '@src/hooks/useAsync'
import { ROUTE, useNavigate, useRouteData } from '@src/routes'
import { signClient } from '@src/wallet-connect'
import { COLUMNS, useWalletConnectStore } from '@store'

type Inputs = {
  uri: string
}

export const WalletConnect: React.FC = () => {
  const parentZone = useSelectionZone()!
  const navigate = useNavigate()

  const connect = useWalletConnectStore((store) => store.connect)
  const disconnect = useWalletConnectStore((store) => store.disconnect)
  const connected = useWalletConnectStore((store) => store.connected())

  const { uri } = useRouteData<ROUTE.WALLET_CONNECT>()

  const { errors, data, isValid, register } = useForm<Inputs>({
    initialValues: {
      uri: uri ?? '',
    },
    rules: {
      uri: walletConnectLink(),
    },
  })

  const { selection, select } = useSelection({
    amount: 2,
    prevKey: 'upArrow',
    nextKey: ['downArrow', 'return'],
    isActive: parentZone.selection === COLUMNS.MAIN,
  })

  const { execute, isLoading, error } = useAsync((call: () => Promise<any>) =>
    call(),
  )

  const onConnect = async () => {
    await connect(data.uri)
    select(0)
  }

  const onDisconnect = async (topic: string) => {
    await disconnect(topic)
    navigate(ROUTE.HOME)
  }

  useEffect(() => {
    if (uri) {
      execute(onConnect)
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
          <Text bold> Active session </Text>
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
          onPress={() => execute(() => onDisconnect(topic))}
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
        <Text bold> Connect to WalletConnect </Text>
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
        onPress={() => execute(onConnect)}
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
