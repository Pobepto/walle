import React, { useState } from 'react'
import { Box, Text } from 'ink'
import { Button } from '@components'
import { useForm, useSelection, walletConnectLink, useWallet } from '@hooks'
import { InputBox } from '@components/InputBox'
import { COLUMNS } from '@store'
import { useSelectionZone } from '@src/components/SelectionZone'
import { useNavigate } from '@src/routes'

import { parseUri } from '@walletconnect/utils'
import SignClient from '@walletconnect/sign-client'
import { CoreTypes, SessionTypes } from '@walletconnect/types'

type Inputs = {
  uri: string
}

const createSignClient = () => {
  return SignClient.init({
    logger: 'debug',
    projectId: '83bd22fbdde53e66f042e2c6fc181fc3',
    relayUrl: 'wss://relay.walletconnect.com',
    metadata: {
      name: 'Walle Wallet',
      description: 'Walle Wallet for WalletConnect',
      url: 'https://walletconnect.com/',
      icons: ['https://avatars.githubusercontent.com/u/37784886'],
    },
  })
}

export const WalletConnect: React.FC = () => {
  const parentZone = useSelectionZone()!
  const navigate = useNavigate()
  const wallet = useWallet()

  const [connection, setConnection] = useState<CoreTypes.Metadata>()

  const { errors, data, isValid, register } = useForm<Inputs>({
    rules: {
      uri: walletConnectLink(),
    },
  })

  const [selection] = useSelection({
    amount: 2,
    prevKey: 'upArrow',
    nextKey: ['downArrow', 'return'],
    isActive: parentZone.selection === COLUMNS.MAIN,
  })

  const onConnect = async () => {
    const signClient = await createSignClient()

    const { version } = parseUri(data.uri)

    if (version === 1) {
      throw new Error('Not supported')
    }

    await signClient.pair({ uri: data.uri })

    signClient.on('session_proposal', async (proposal) => {
      const {
        params: { id, requiredNamespaces, relays, proposer },
      } = proposal

      const selectedAccounts: Record<string, string[]> = {}
      Object.keys(requiredNamespaces).forEach((key) => {
        selectedAccounts[key] = ['DQbCUByEu8t8WpqB5UAm7guiR27NjQnaD5G2NrTLWkAj'] // [wallet!.address]
      })

      const namespaces: SessionTypes.Namespaces = {}
      Object.keys(requiredNamespaces).forEach((key) => {
        const accounts: string[] = []
        requiredNamespaces[key].chains.map((chain) => {
          selectedAccounts[key].map((acc) => accounts.push(`${chain}:${acc}`))
        })
        namespaces[key] = {
          accounts,
          methods: requiredNamespaces[key].methods,
          events: requiredNamespaces[key].events,
        }
      })

      const { acknowledged } = await signClient.approve({
        id,
        relayProtocol: relays[0].protocol,
        namespaces,
      })
      await acknowledged()

      setConnection(proposer.metadata)
    })

    signClient.on('session_request', (data) => console.log('request', data))
    signClient.on('session_ping', (data) => console.log('ping', data))
    signClient.on('session_event', (data) => console.log('event', data))
    signClient.on('session_update', (data) => console.log('update', data))
    signClient.on('session_delete', (data) => console.log('delete', data))
  }

  return (
    <Box flexDirection="column">
      <Box marginTop={-1}>
        <Text> Connect to WalletConnect </Text>
      </Box>
      {connection ? (
        <Text>
          {connection.name} {connection.url}
        </Text>
      ) : (
        <InputBox
          label="WalletConnect URI"
          error={errors.uri}
          focus={selection === 0}
          {...register('uri')}
        />
      )}

      <Button
        isFocused={selection === 1}
        onPress={onConnect}
        isDisabled={!isValid}
      >
        Connect
      </Button>
    </Box>
  )
}
