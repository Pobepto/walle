import React from 'react'
import { Box, Text } from 'ink'
import { COLUMNS, useWalletConnectStore } from '@store'
import {
  Selection,
  SelectionZone,
  useSelectionZone,
} from '@src/components/SelectionZone'
import { Redirect, ROUTE } from '@src/routes'

export const WalletConnectRequests: React.FC = () => {
  const parentZone = useSelectionZone()!
  const pendingRequests = useWalletConnectStore((store) => store.requests)
  const proposal = useWalletConnectStore((store) => store.proposal)

  if (!proposal) {
    return <Redirect to={ROUTE.WALLET_CONNECT} />
  }

  const { proposer } = proposal.params

  return (
    <Box flexDirection="column">
      <Box marginTop={-1}>
        <Text> Pending requests from {proposer.metadata.name} </Text>
      </Box>
      <SelectionZone
        prevKey="upArrow"
        nextKey="downArrow"
        isActive={parentZone.selection === COLUMNS.MAIN}
      >
        {pendingRequests.map((request) => (
          <Selection key={request.id}>
            <Box flexDirection="column" borderStyle="classic" paddingX={1}>
              <Text>
                [{request.params.chainId}] {request.params.request.method}
              </Text>
              <Text>{JSON.stringify(request.params.request.params)}</Text>
            </Box>
          </Selection>
        ))}
      </SelectionZone>
    </Box>
  )
}
