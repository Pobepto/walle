import React from 'react'
import { Box, Text } from 'ink'
import { COLUMNS } from '@store'
import {
  Selection,
  SelectionZone,
  useSelectionZone,
} from '@src/components/SelectionZone'
import { signClient } from '@src/wallet-connect'

export const WalletConnectPairings: React.FC = () => {
  const parentZone = useSelectionZone()!

  const pairings = signClient.pairing.values

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
