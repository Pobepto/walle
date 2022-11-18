import React, { useEffect, useState } from 'react'
import { Box, Text } from 'ink'
import { Button } from '@components'
import {
  combine,
  isAddress,
  isIntegerNumber,
  length,
  numberInRange,
  useForm,
} from '@hooks'
import { InputBox } from '@components/InputBox'
import { COLUMNS, useBlockchainStore, useTokensStore } from '@store'
import {
  Selection,
  SelectionZone,
  useSelectionZone,
} from '@src/components/SelectionZone'
import { Contract } from '@ethersproject/contracts'
import { ERC20_ABI } from '@src/store/blockchain/interfaces'

type Inputs = {
  name: string
  symbol: string
  decimals: string
  address: string
}

export const AddToken: React.FC = () => {
  const parentZone = useSelectionZone()!
  const [tokenInfoIsLoading, setTokenInfoLoading] = useState(false)
  const [error, setError] = useState('')
  const addToken = useTokensStore((state) => state.addToken)
  const provider = useBlockchainStore((state) => state.provider)

  const { errors, register, change, inputIsValid, isValid, data } =
    useForm<Inputs>({
      rules: {
        name: length(1),
        symbol: length(1),
        decimals: combine(isIntegerNumber(), numberInRange(0, 18)),
        address: isAddress(),
      },
    })

  const onSubmit = () => {
    addToken({
      name: data.name,
      symbol: data.symbol,
      decimals: Number(data.decimals),
      address: data.address,
    })
  }

  useEffect(() => {
    const load = async () => {
      try {
        const contract = new Contract(data.address, ERC20_ABI, provider)

        setError('')
        setTokenInfoLoading(true)

        const [name, symbol, decimals] = await Promise.all([
          contract.callStatic.name(),
          contract.callStatic.symbol(),
          contract.callStatic.decimals(),
        ])

        change('name', name, true)
        change('symbol', symbol, true)
        change('decimals', decimals.toString(), true)
      } catch {
        setError("Can't load information about this token")
      } finally {
        setTokenInfoLoading(false)
      }
    }

    if (inputIsValid('address')) {
      load()
    }
  }, [data.address])

  return (
    <SelectionZone
      prevKey="upArrow"
      nextKey={['downArrow', 'return']}
      isActive={parentZone.selection === COLUMNS.MAIN}
    >
      <Box flexDirection="column">
        <Box marginTop={-1}>
          <Text> Add new token </Text>
        </Box>
        {error ? (
          <Box borderStyle="single" borderColor="redBright" paddingX={1}>
            <Text color="red">{error}</Text>
          </Box>
        ) : null}
        <Selection activeProps={{ focus: true }}>
          <InputBox
            label="Address"
            error={errors.address}
            {...register('address')}
          />
        </Selection>
        <Selection activeProps={{ focus: true }}>
          <InputBox
            label="Name"
            error={errors.name}
            loading={tokenInfoIsLoading}
            {...register('name')}
          />
        </Selection>
        <Selection activeProps={{ focus: true }}>
          <InputBox
            label="Symbol"
            error={errors.symbol}
            loading={tokenInfoIsLoading}
            {...register('symbol')}
          />
        </Selection>
        <Selection activeProps={{ focus: true }}>
          <InputBox
            label="Decimals"
            error={errors.decimals}
            loading={tokenInfoIsLoading}
            {...register('decimals')}
          />
        </Selection>

        <Selection activeProps={{ isFocused: true }}>
          <Button onPress={onSubmit} isDisabled={!isValid}>
            Add token
          </Button>
        </Selection>
      </Box>
    </SelectionZone>
  )
}
