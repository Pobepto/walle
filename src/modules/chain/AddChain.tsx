import React, { useEffect } from 'react'
import { Box, Text } from 'ink'

import { Button, ButtonProps, Error as ErrorLabel } from '@components'
import { InputBox } from '@components/InputBox'
import {
  combine,
  isIntegerNumber,
  length,
  link,
  numberInRange,
  useForm,
  useSelection,
} from '@hooks'
import { ButtonLink } from '@src/components/ButtonLink'
import {
  Selection,
  SelectionZone,
  useSelectionZone,
} from '@src/components/SelectionZone'
import { COLUMNS } from '@src/constants'
import { useAsync } from '@src/hooks/useAsync'
import { ROUTE, useNavigate, useRouteData } from '@src/routes'
import { useBlockchainStore } from '@store'

export const AddChain: React.FC = () => {
  const parentZone = useSelectionZone()!
  const navigate = useNavigate()

  const { chain, edit } = useRouteData<ROUTE.ADD_CHAIN>()

  const addChain = useBlockchainStore((state) => state.addChain)
  const loadChainId = useBlockchainStore((state) => state.loadChainId)
  const chains = useBlockchainStore((state) => state.chains)

  const { errors, data, isValid, register, change, inputIsValid } = useForm({
    initialValues: {
      name: chain?.name ?? '',
      rpc: chain?.rpc ?? '',
      chainId: String(chain?.chainId ?? ''),
      explorer: chain?.explorer ?? '',
      currency: chain?.currency ?? '',
    },
    rules: {
      name: length(1),
      rpc: link(),
      chainId: combine(isIntegerNumber(), numberInRange(1, Infinity)),
      explorer: link(),
      currency: length(1),
    },
  })

  const isAlreadyAddedChain = Boolean(
    chains.find((c) => c.chainId.toString() === data.chainId),
  )

  const { selection } = useSelection({
    amount: 5,
    prevKey: 'upArrow',
    nextKey: ['downArrow', 'return'],
    isActive: parentZone.selection === COLUMNS.MAIN,
  })

  const {
    safeExecute: callAddChain,
    isLoading: addChainIsLoading,
    error: addChainError,
  } = useAsync(() =>
    addChain({
      name: data.name,
      rpc: data.rpc,
      chainId: Number(data.chainId),
      currency: data.currency,
      explorer: data.explorer,
    }),
  )

  const onSubmit = async () => {
    await callAddChain()
    navigate(ROUTE.SWITCH_CHAIN)
  }

  const {
    execute: callLoadChainId,
    isLoading: chainIdIsLoading,
    error: providerError,
    clearError,
  } = useAsync(loadChainId)

  useEffect(() => {
    if (inputIsValid('rpc')) {
      callLoadChainId(data.rpc)
        .then((chainId) => change('chainId', chainId, true))
        .catch(() => change('chainId', '', true))
    } else {
      clearError()
    }
  }, [data.rpc])

  return (
    <Box flexDirection="column">
      <Box marginTop={-1}>
        <Text bold> Add new chain </Text>
      </Box>
      {!edit && !!chain && (
        <Box borderStyle="single" borderColor="red" alignItems="center">
          <ErrorLabel text="The network data was obtained from an external source, please make sure it is reliable before adding this network" />
        </Box>
      )}
      <InputBox
        label="Name"
        error={errors.name}
        focus={selection === 0}
        {...register('name')}
      />
      <InputBox
        label="Rpc"
        error={providerError || errors.rpc}
        focus={selection === 1}
        {...register('rpc')}
      />
      <InputBox
        label="Chain Id"
        type="number"
        error={errors.chainId}
        loading={chainIdIsLoading}
        disabled
        {...register('chainId')}
      />
      <InputBox
        label="Explorer"
        error={errors.explorer}
        focus={selection === 2}
        {...register('explorer')}
      />
      <InputBox
        label="Currency"
        error={errors.currency}
        focus={selection === 3}
        {...register('currency')}
      />

      <SelectionZone
        prevKey="leftArrow"
        nextKey="rightArrow"
        defaultSelection={1}
        isActive={selection === 4}
      >
        <Box justifyContent="space-around">
          <Selection<ButtonProps> activeProps={{ isFocused: true }}>
            <ButtonLink to={ROUTE.SWITCH_CHAIN} minWidth="20%" paddingX={1}>
              Cancel
            </ButtonLink>
          </Selection>
          <Selection<ButtonProps> activeProps={{ isFocused: true }}>
            <Button
              onPress={onSubmit}
              minWidth="20%"
              paddingX={1}
              isLoading={addChainIsLoading}
              isDisabled={!isValid || !!providerError || chainIdIsLoading}
            >
              {isAlreadyAddedChain ? 'Edit chain' : 'Add chain'}
            </Button>
          </Selection>
        </Box>
        <Box justifyContent="center">
          <ErrorLabel text={addChainError} />
        </Box>
      </SelectionZone>
    </Box>
  )
}
