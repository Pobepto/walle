import React, { useEffect, useState } from 'react'
import { Box, Text } from 'ink'

import AsyncButton from '@src/components/AsyncButton'
import {
  Selection,
  SelectionZone,
  useSelectionZone,
} from '@src/components/SelectionZone'
import { useKey } from '@src/hooks'
import { COLUMNS, useWalletConnectStore } from '@store'
import { PairingTypes } from '@walletconnect/types'

interface PairingProps {
  pairing: PairingTypes.Struct
  isActive: boolean
  onDelete: (topic: string) => Promise<void>
}

const Pairing: React.FC<PairingProps> = ({ pairing, isActive, onDelete }) => {
  const [actionsIsOpen, setActionsOpen] = useState(false)

  useKey('return', () => setActionsOpen(true), isActive && !actionsIsOpen)

  useEffect(() => {
    if (!isActive) {
      setActionsOpen(false)
    }
  }, [isActive])

  return (
    <Box
      flexDirection="column"
      borderStyle={isActive ? 'double' : 'classic'}
      paddingX={1}
    >
      <Text>
        {pairing.peerMetadata?.name} {pairing.peerMetadata?.url}
      </Text>
      <Text>{pairing.peerMetadata?.description}</Text>
      {actionsIsOpen ? (
        <AsyncButton
          onPress={() => onDelete(pairing.topic)}
          isFocused={actionsIsOpen}
        >
          Delete
        </AsyncButton>
      ) : null}
    </Box>
  )
}

export const WalletConnectPairings: React.FC = () => {
  const parentZone = useSelectionZone()!

  const disconnect = useWalletConnectStore((store) => store.disconnect)
  const pairings = useWalletConnectStore((store) => store.pairings())

  return (
    <Box flexDirection="column">
      <Box marginTop={-1}>
        <Text bold> Connected dapps </Text>
      </Box>
      {pairings.length ? (
        <SelectionZone
          prevKey="upArrow"
          nextKey="downArrow"
          isActive={parentZone.selection === COLUMNS.MAIN}
        >
          {pairings.map((pairing) => (
            <Selection key={pairing.topic}>
              {(isActive) => (
                <Pairing
                  pairing={pairing}
                  isActive={isActive}
                  onDelete={disconnect}
                />
              )}
            </Selection>
          ))}
        </SelectionZone>
      ) : (
        <Text>Empty</Text>
      )}
    </Box>
  )
}
