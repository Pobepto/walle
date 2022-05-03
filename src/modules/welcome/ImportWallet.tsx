import { Box, Text } from 'ink'

import React from 'react'
import { Button, Input } from '../../components'
import { useForm } from '../../hooks/useForm'
import { useSelection } from '../../hooks/useSelection'
import { ROUTE, useNavigate } from '../../routes'
import { useAccountStore } from '../../store'

type Inputs = {
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  7: string;
  8: string;
  9: string;
  10: string;
  11: string;
}

const generateSeedObject = (wordLen: number) => {
  const wordInRow = 4
  const rows = wordLen / wordInRow
  const result = new Array(rows)
    .fill(
      new Array(wordInRow).fill({})
    )
    .map(
      (row, rowIndex) => row.map(
        (_, index) => (({
          key: index + (rowIndex * wordInRow),
          text: `${index + (rowIndex * wordInRow) + 1}.`
        }))
      )
    )

  return result
}

export const ImportWallet: React.FC = () => {
  const navigate = useNavigate()
  const selection = useSelection(13, 'tab', 'return')
  const importWallet = useAccountStore(state => state.importWallet)
  const { data, register, errors, isValid } = useForm<Inputs>({
    initialValues: {
      0: 'sun'
    },
    rules: {
      0: (value) => value.length > 10 ? '' : 'too small'
    }
  })

  const onImport = () => {
    if (!isValid) {
      return
    }

    console.log('import')

    // try to import
    const phrase = Object.values(data).join(' ')
    importWallet(phrase)
    // save to store

    navigate(ROUTE.REGISTRATION_PASSWORD)
  }

  const seed = generateSeedObject(12)

  return (
    <Box flexDirection="column" width="100%">
      <Box>
        <Text>Import {errors['0']}</Text>
      </Box>
      <Box flexDirection="column">
        {seed.map((row, index) => {
          return (
            <Box key={`row-${index}`} flexDirection="row" alignItems="center">
              {row.map(({ key, text }) => {
                return (
                  <Box key={key} flexDirection="row" borderStyle="classic" width="30"
                  borderColor={errors[key] && errors[key].length && 'red'}>
                    <Text>{text}</Text>
                    <Input
                      {...register(key)}
                      focus={selection === key}
                    />
                  </Box>
                )
              })}
            </Box>
          )
        })}
      </Box>
      <Button
        keyType="return"
        isFocused={selection === 12}
        onPress={onImport}
      >
        Import wallet
      </Button>
    </Box>
  )
}
