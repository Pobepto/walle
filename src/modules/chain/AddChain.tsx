import React, { useState } from 'react'
import { Box, Text } from 'ink'
import { Button } from '@components'
import {
  combine,
  isNumber,
  length,
  numberInRange,
  useForm,
  useSelection,
} from '@hooks'
import { InputBox } from '@components/InputBox'
import { COLUMNS, useAppStore, useBlockchainStore } from '@store'

type Inputs = {
  name: string
  rpc: string
  chainId: string
  explorer: string
  currencyName: string
  currencySymbol: string
  currencyDecimals: string
}

export const AddChain: React.FC = () => {
  // const navigate = useNavigate()
  const activeColumn = useAppStore((state) => state.activeColumn)
  const addChain = useBlockchainStore((state) => state.addChain)
  const { errors, register, validate, data } = useForm<Inputs>({
    rules: {
      name: length(3),
      rpc: length(3),
      chainId: combine(isNumber(), numberInRange(0, Infinity)),
      explorer: length(3),
      currencyName: length(3),
      currencySymbol: length(3),
      currencyDecimals: combine(isNumber(), numberInRange(0, 18)),
    },
    options: {
      validateAction: 'never',
    },
  })

  const [step, setStep] = useState(0)

  const [selection, setSelection, prevent] = useSelection(
    step === 0 ? 5 : 4,
    'upArrow',
    ['downArrow', 'return'],
    activeColumn === COLUMNS.MAIN,
    false,
  )

  const onSubmit = () => {
    const [isValid] = validate()

    if (isValid) {
      addChain({
        name: data.name,
        rpc: data.rpc,
        chainId: Number(data.chainId),
        currency: {
          name: data.currencyName,
          symbol: data.currencySymbol,
          decimals: Number(data.currencyDecimals),
        },
        explorer: data.explorer,
      })
    } else {
      prevent()
      // TODO: focus on first error
      setSelection(0)
    }
  }

  return (
    <Box flexDirection="column">
      <Box marginTop={-1}>
        <Text> Add new chain </Text>
      </Box>
      {step === 0 && (
        <>
          <InputBox
            label="Name"
            error={errors.name}
            focus={selection === 0}
            {...register('name')}
          />
          <InputBox
            label="Rpc"
            error={errors.rpc}
            focus={selection === 1}
            {...register('rpc')}
          />
          <InputBox
            label="Chain Id"
            error={errors.chainId}
            focus={selection === 2}
            {...register('chainId')}
          />
          <InputBox
            label="Explorer"
            error={errors.explorer}
            focus={selection === 3}
            {...register('explorer')}
          />

          <Button isFocused={selection === 4} onPress={() => setStep(1)}>
            Set up currency...
          </Button>
        </>
      )}

      {step === 1 && (
        <>
          <InputBox
            label="Currency name"
            error={errors.currencyName}
            focus={selection === 0}
            {...register('currencyName')}
          />
          <InputBox
            label="Currency symbol"
            error={errors.currencySymbol}
            focus={selection === 1}
            {...register('currencySymbol')}
          />
          <InputBox
            label="Currency decimals"
            error={errors.currencyDecimals}
            focus={selection === 2}
            {...register('currencyDecimals')}
          />

          <Button isFocused={selection === 3} onPress={onSubmit}>
            Add chain
          </Button>
        </>
      )}
    </Box>
  )
}
