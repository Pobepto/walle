import React, { useEffect, useState } from 'react'
import { Box, Text } from 'ink'

import { Button, ButtonProps, Error } from '@components'
import { InputBox } from '@components/InputBox'
import { JsonRpcProvider } from '@ethersproject/providers'
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
import { useAsync } from '@src/hooks/useAsync'
import { ROUTE, useNavigate, useRouteData } from '@src/routes'
import { COLUMNS, useBlockchainStore } from '@store'

type Inputs = {
  name: string
  rpc: string
  chainId: string
  explorer: string
  currency: string
}

export const AddChain: React.FC = () => {
  const parentZone = useSelectionZone()!
  const navigate = useNavigate()
  const [networkIsLoading, setNetworkLoading] = useState(false)
  const [rpcError, setRpcError] = useState('')

  const { chain, edit } = useRouteData<ROUTE.ADD_CHAIN>() ?? {}

  const addChain = useBlockchainStore((state) => state.addChain)
  const chains = useBlockchainStore((state) => state.chains)

  const { errors, data, isValid, register, change, inputIsValid } =
    useForm<Inputs>({
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

  const { execute: callAddChain, isLoading: addChainIsLoading } = useAsync(() =>
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

  useEffect(() => {
    const check = async () => {
      try {
        setNetworkLoading(true)
        const provider = new JsonRpcProvider(data.rpc, 'any')
        const providerNetwork = await provider.getNetwork()

        change('chainId', providerNetwork.chainId.toString(), true)
      } catch {
        setRpcError("Can't get chain id from this rpc")
        change('chainId', '', true)
      } finally {
        setNetworkLoading(false)
      }
    }

    setRpcError('')

    if (inputIsValid('rpc')) {
      check()
    }
  }, [data.rpc])

  return (
    <Box flexDirection="column">
      <Box marginTop={-1}>
        <Text bold> Add new chain </Text>
      </Box>
      {!edit && !!chain && (
        <Box borderStyle="single" borderColor="red" alignItems="center">
          <Error text="The network data was obtained from an external source, please make sure it is reliable before adding this network" />
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
        error={rpcError || errors.rpc}
        focus={selection === 1}
        {...register('rpc')}
      />
      <InputBox
        label="Chain Id"
        error={errors.chainId}
        loading={networkIsLoading}
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
              isDisabled={!isValid || !!rpcError || networkIsLoading}
            >
              {isAlreadyAddedChain ? 'Edit chain' : 'Add chain'}
            </Button>
          </Selection>
        </Box>
      </SelectionZone>
    </Box>
  )
}
