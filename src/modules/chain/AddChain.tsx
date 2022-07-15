import React from 'react'
import { Box, Text } from 'ink'
import { Button } from '@components'
import { isNumber, lengthRule, useForm, useSelection } from '@hooks'
import { InputBox } from '@components/InputBox'
import { COLUMNS, useAppStore, useBlockchainStore } from '@store'

type Inputs = {
  name: string
  rpc: string
  chainId: string
  explorer: string
}

export const AddChain: React.FC = () => {
  // const navigate = useNavigate()
  const activeColumn = useAppStore((state) => state.activeColumn)
  const addChain = useBlockchainStore((state) => state.addChain)
  const { errors, register, validateAll, data } = useForm<Inputs>({
    rules: {
      name: lengthRule(3),
      rpc: lengthRule(3),
      chainId: isNumber(),
      explorer: lengthRule(3),
    },
    options: {
      validateAction: 'never',
    },
  })

  const [selection, setSelection, prevent] = useSelection(
    5,
    'upArrow',
    ['downArrow', 'return'],
    activeColumn === COLUMNS.MAIN,
    false,
  )

  const onSubmit = () => {
    const [isValid] = validateAll()

    if (isValid) {
      addChain({
        name: data.name,
        rpc: data.rpc,
        chainId: Number(data.chainId),
        currency: {
          name: 'Native',
          symbol: 'NTV',
          decimals: 18,
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

      <Button isFocused={selection === 4} onPress={onSubmit}>
        Add chain
      </Button>
    </Box>
  )
}
