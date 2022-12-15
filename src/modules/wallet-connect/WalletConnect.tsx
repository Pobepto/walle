import React, { useState } from 'react'
import { Box, Text } from 'ink'
import { Button } from '@components'
import { useForm, useSelection, walletConnectLink, useWallet } from '@hooks'
import { InputBox } from '@components/InputBox'
import { COLUMNS, useWalletConnectStore } from '@store'
import { useSelectionZone } from '@src/components/SelectionZone'
import { useNavigate } from '@src/routes'
import { disconnect } from 'process'

type Inputs = {
  uri: string
}

export const WalletConnect: React.FC = () => {
  const parentZone = useSelectionZone()!
  const signClient = useWalletConnectStore((store) => store.signClient)
  const connect = useWalletConnectStore((store) => store.connect)
  const approve = useWalletConnectStore((store) => store.approve)
  const disconnect = useWalletConnectStore((store) => store.disconnect)
  const proposal = useWalletConnectStore((store) => store.proposal)

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
    await connect(data.uri)
    select(0)
    // signClient.on('session_request', (data) => console.log('request', data))
    // signClient.on('session_ping', (data) => console.log('ping', data))
    // signClient.on('session_event', (data) => console.log('event', data))
    // signClient.on('session_update', (data) => console.log('update', data))
  }

  return (
    <Box flexDirection="column">
      <Box marginTop={-1}>
        <Text> Connect to WalletConnect </Text>
      </Box>
      {proposal ? (
        <>
          <Text>
            {proposal.params.proposer.metadata.name}{' '}
            {proposal.params.proposer.metadata.url}
          </Text>
          <Button isFocused={selection === 0} onPress={disconnect}>
            No
          </Button>
          <Button isFocused={selection === 1} onPress={approve}>
            Yes
          </Button>
        </>
      ) : (
        <>
          <InputBox
            label="WalletConnect URI"
            error={errors.uri}
            focus={selection === 0}
            {...register('uri')}
          />
          <Button
            isFocused={selection === 1}
            onPress={onConnect}
            isDisabled={!isValid}
          >
            Connect
          </Button>
        </>
      )}
    </Box>
  )
}
