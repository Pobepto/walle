import React from 'react'
import { Box, Text } from 'ink'
import { COLUMNS, useWalletConnectStore } from '@store'
import {
  Selection,
  SelectionZone,
  useSelectionZone,
} from '@src/components/SelectionZone'
import { Redirect, ROUTE } from '@src/routes'

export const WalletConnectPairings: React.FC = () => {
  const parentZone = useSelectionZone()!
  const connected = useWalletConnectStore((store) => store.connected)
  const signClient = useWalletConnectStore((store) => store.signClient)

  if (!connected) {
    return <Redirect to={ROUTE.WALLET_CONNECT} />
  }

  const pairings = signClient!.pairing.values

  return (
    <Box flexDirection="column">
      <Box marginTop={-1}>
        <Text> Connected dapps </Text>
      </Box>
      <SelectionZone
        prevKey="upArrow"
        nextKey="downArrow"
        isActive={parentZone.selection === COLUMNS.MAIN}
      >
        {pairings.map((pairing) => (
          <Selection
            key={pairing.topic}
            activeProps={{ borderStyle: 'double' }}
          >
            <Box flexDirection="column" borderStyle="classic" paddingX={1}>
              <Text>
                {pairing.peerMetadata?.name} {pairing.peerMetadata?.url}
              </Text>
              <Text>{pairing.peerMetadata?.description}</Text>
            </Box>
          </Selection>
        ))}
      </SelectionZone>
    </Box>
  )
}
