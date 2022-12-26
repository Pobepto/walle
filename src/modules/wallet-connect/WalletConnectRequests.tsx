import React, { useEffect, useState } from 'react'
import { Box, Text } from 'ink'
import { COLUMNS, useWalletConnectStore } from '@store'
import {
  Selection,
  SelectionZone,
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
import { ButtonProps } from '@src/components'
import { TextButton } from '@src/components/TextButton'
import { List } from '@src/components/List'
import { Redirect, ROUTE } from '@src/routes'

interface RequestItemProps {
  request: SessionRequest
  isActive?: boolean
  onApprove: (request: SessionRequest) => void
  onReject: (request: SessionRequest) => void
  pressKey: SuperKey | SuperKey[]
}

const RequestItem: React.FC<RequestItemProps> = ({
  request,
  isActive = false,
  onApprove,
  onReject,
  pressKey,
}) => {
  const [actionsIsOpen, setActionsOpen] = useState(false)

  useKey(
    pressKey,
    () => {
      setActionsOpen((v) => !v)
    },
    isActive,
  )

  useEffect(() => {
    if (!isActive) {
      setActionsOpen(false)
    }
  }, [isActive])

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
      {actionsIsOpen && (
        <SelectionZone
          isActive={isActive}
          prevKey="leftArrow"
          nextKey="rightArrow"
        >
          <Box justifyContent="center">
            <Selection<ButtonProps> activeProps={{ isFocused: true }}>
              <TextButton onPress={() => onReject(request)}>Reject</TextButton>
            </Selection>
            <Text>{'  '}</Text>
            <Selection<ButtonProps> activeProps={{ isFocused: true }}>
              <TextButton onPress={() => onApprove(request)}>
                Approve
              </TextButton>
            </Selection>
          </Box>
        </SelectionZone>
      )}
    </Box>
  )
}

export const WalletConnectRequests: React.FC = () => {
  const parentZone = useSelectionZone()!
  const handleRequest = useWalletConnectRequestHandler()
  const pendingRequests = useWalletConnectStore((store) => store.requests)
  const proposal = useWalletConnectStore((store) => store.proposal)
  const connected = useWalletConnectStore((store) => store.connected)
  const rejectRequest = useWalletConnectStore((store) => store.rejectRequest)

  const [amount, setAmount] = useState(0)
  const [selection, select] = useSelection({
    amount,
    prevKey: 'upArrow',
    nextKey: 'downArrow',
    isActive: parentZone.selection === COLUMNS.MAIN,
  })

  if (!connected) {
    return <Redirect to={ROUTE.WALLET_CONNECT} />
  }

  const { proposer } = proposal!.params

  return (
    <Box flexDirection="column">
      <Box marginTop={-1}>
        <Text> Pending requests from {proposer.metadata.name} </Text>
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
                onReject={rejectRequest}
              />
            </Selection>
          ))}
        </List>
      </UncontrolledSelectionZone>
    </Box>
  )
}
