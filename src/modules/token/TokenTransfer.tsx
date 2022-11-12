import React from 'react'
import { Box, Text } from 'ink'
import { ROUTE, useData, useNavigate } from '@src/routes'
import {
  Selection,
  SelectionZone,
  useSelectionZone,
} from '@src/components/SelectionZone'
import { COLUMNS, useTokensStore } from '@src/store'
import { InputBox } from '@src/components/InputBox'
import {
  combine,
  isAddress,
  isNumber,
  numberInRange,
  useContract,
  useForm,
} from '@src/hooks'
import { Button } from '@src/components'
import { ERC20_ABI } from '@src/store/blockchain/contract'
import { Loader } from '@src/components/Loader'

type Inputs = {
  receiver: string
  amount: string
}

export const TokenTransfer: React.FC = () => {
  const navigate = useNavigate()
  const parentZone = useSelectionZone()!
  const token = useData<ROUTE.TOKEN_TRANSFER>()
  const balances = useTokensStore((store) => store.balances)
  const balancesIsLoading = useTokensStore((store) => store.balancesIsLoading)

  // TODO: We can handle this error using ErrorBoundary in parent component
  if (!token) {
    throw new Error('Token not found')
  }

  const ERC20 = useContract(token.address, ERC20_ABI)

  const balance = balances.get(token.address) ?? '0'

  const { register, data, errors, isValid } = useForm<Inputs>({
    rules: {
      receiver: isAddress(),
      amount: combine(isNumber(), numberInRange(0, Number(balance))),
    },
    options: {
      validateAction: 'blur',
    },
  })

  const onTransfer = async () => {
    if (isValid) {
      const populatedTx = await ERC20.populateTransaction.transfer(
        data.receiver,
        data.amount,
      )

      navigate(ROUTE.CONFIRM_TRANSACTION, populatedTx)
    }
  }

  return (
    <SelectionZone
      prevKey="upArrow"
      nextKey={['downArrow', 'return']}
      isActive={parentZone.selection === COLUMNS.MAIN}
    >
      <Box flexDirection="column">
        <Box marginTop={-1}>
          <Text>
            {' '}
            Transfer {token.name} ({token.symbol}){' '}
          </Text>
        </Box>
        <Selection activeProps={{ focus: true }}>
          <InputBox
            label="Receiver"
            error={errors.receiver}
            {...register('receiver')}
          />
        </Selection>
        <Text>
          <Text bold>Balance:</Text>{' '}
          <Loader loading={balancesIsLoading}>{balance}</Loader>{' '}
        </Text>
        <Selection activeProps={{ focus: true }}>
          <InputBox
            label="Amount"
            error={errors.amount}
            loading={balancesIsLoading}
            {...register('amount')}
          />
        </Selection>
        <Selection activeProps={{ isActive: true }}>
          <SelectionZone
            prevKey="leftArrow"
            nextKey="rightArrow"
            defaultSelection={1}
          >
            <Box justifyContent="space-around">
              <Selection activeProps={{ isFocused: true }}>
                <Button
                  onPress={() => navigate(ROUTE.TOKEN_ACTIONS, token)}
                  minWidth="20%"
                  paddingX={1}
                >
                  <Text>{'<-'} Back</Text>
                </Button>
              </Selection>
              <Selection activeProps={{ isFocused: true }}>
                <Button onPress={onTransfer} minWidth="20%" paddingX={1}>
                  <Text>Transfer {'->'}</Text>
                </Button>
              </Selection>
            </Box>
          </SelectionZone>
        </Selection>
      </Box>
    </SelectionZone>
  )
}
