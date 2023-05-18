import React from 'react'
import { parseUnits } from 'ethers'
import { Box, Text } from 'ink'

import { Button, ButtonProps } from '@src/components'
import { InputBox, InputBoxProps } from '@src/components/InputBox'
import {
  Selection,
  SelectionZone,
  SelectionZoneProps,
  useSelectionZone,
} from '@src/components/SelectionZone'
import { COLUMNS } from '@src/constants'
import { isAddress, isNumber, useContract, useForm } from '@src/hooks'
import { ROUTE, useNavigate, useRouteData } from '@src/routes'
import { ERC20_ABI } from '@src/store/blockchain/interfaces'

export const TokenApprove: React.FC = () => {
  const parentZone = useSelectionZone()!
  const navigate = useNavigate()
  const token = useRouteData<ROUTE.TOKEN_APPROVE>()
  const ERC20 = useContract(token.address, ERC20_ABI)

  const { register, data, errors, isValid } = useForm({
    initialValues: {
      spender: '',
      amount: '',
    },
    rules: {
      spender: isAddress(),
      amount: isNumber(),
    },
    validateAction: 'blur',
  })

  const onApprove = async () => {
    const amount = parseUnits(data.amount, token.decimals)
    const populatedTx = await ERC20.approve.populateTransaction(
      data.spender,
      amount.toString(),
    )

    navigate(ROUTE.CONFIRM_TRANSACTION, {
      target: ERC20,
      populatedTx,
    })
  }

  return (
    <SelectionZone
      prevKey="upArrow"
      nextKey={['downArrow', 'return']}
      isActive={parentZone.selection === COLUMNS.MAIN}
    >
      <Box flexDirection="column">
        <Box marginTop={-1}>
          <Text bold> Approve </Text>
        </Box>
        <Selection<InputBoxProps> activeProps={{ focus: true }}>
          <InputBox
            label="Spender"
            error={errors.spender}
            {...register('spender')}
          />
        </Selection>
        <Selection<InputBoxProps> activeProps={{ focus: true }}>
          <InputBox
            type="number"
            label="Amount"
            error={errors.amount}
            {...register('amount')}
          />
        </Selection>
        <Selection<SelectionZoneProps> activeProps={{ isActive: true }}>
          <SelectionZone
            prevKey="leftArrow"
            nextKey="rightArrow"
            defaultSelection={1}
          >
            <Box justifyContent="space-around">
              <Selection<ButtonProps> activeProps={{ isFocused: true }}>
                <Button onPress={navigate.back} minWidth="20%" paddingX={1}>
                  <Text>{'<-'} Back</Text>
                </Button>
              </Selection>
              <Selection<ButtonProps> activeProps={{ isFocused: true }}>
                <Button
                  onPress={onApprove}
                  minWidth="20%"
                  paddingX={1}
                  isDisabled={!isValid}
                >
                  <Text>Approve {'->'}</Text>
                </Button>
              </Selection>
            </Box>
          </SelectionZone>
        </Selection>
      </Box>
    </SelectionZone>
  )
}
