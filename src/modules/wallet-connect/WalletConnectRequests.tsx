import React, { useState } from 'react'
import { Box, Text } from 'ink'
import { COLUMNS, useWalletConnectStore } from '@store'
import {
  Selection,
  UncontrolledSelectionZone,
  useSelectionZone,
} from '@src/components/SelectionZone'
import {
  SuperKey,
  useKey,
  useSelection,
  useWalletConnectRequestHandler,
} from '@src/hooks'
import { SessionRequest } from '@src/store/wallet-connect/actions'
import { List } from '@src/components/List'

interface RequestItemProps {
  request: SessionRequest
  isActive?: boolean
  onApprove: (request: SessionRequest) => void
  pressKey: SuperKey | SuperKey[]
}

const RequestItem: React.FC<RequestItemProps> = ({
  request,
  isActive = false,
  onApprove,
  pressKey,
}) => {
  useKey(pressKey, () => onApprove(request), isActive)

  const { params } = request

  return (
    <Box
      flexDirection="column"
      borderStyle={isActive ? 'double' : 'classic'}
      paddingX={1}
    >
      <Text>
        [{params.chainId}] {params.request.method}
      </Text>
      <Text>{JSON.stringify(params.request.params, null, 2)}</Text>
    </Box>
  )
}

export const WalletConnectRequests: React.FC = () => {
  const parentZone = useSelectionZone()!
  const handleRequest = useWalletConnectRequestHandler()
  const pendingRequests = useWalletConnectStore((store) => store.requests)

  const [amount, setAmount] = useState(0)
  const [selection, select] = useSelection({
    amount,
    prevKey: 'upArrow',
    nextKey: 'downArrow',
    isActive: parentZone.selection === COLUMNS.MAIN,
  })

  return (
    <Box flexDirection="column">
      <Box marginTop={-1}>
        <Text> Pending requests </Text>
      </Box>
      <UncontrolledSelectionZone
        select={select}
        selection={selection}
        isActive={parentZone.selection === COLUMNS.MAIN}
        onChangeAmount={setAmount}
      >
        <List viewport={1} selection={selection}>
          {pendingRequests.map((request) => (
            <Selection<RequestItemProps>
              key={request.id}
              activeProps={{ isActive: true }}
            >
              <RequestItem
                request={request}
                pressKey="return"
                onApprove={handleRequest}
              />
            </Selection>
          ))}
        </List>
      </UncontrolledSelectionZone>
    </Box>
  )
}
