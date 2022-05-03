import { Box, Text } from 'ink'

import React from 'react'
import { Button, Input } from '../../components'
import { lengthRule, useForm } from '../../hooks/useForm'
import { useSelection } from '../../hooks/useSelection'
import { ROUTE, useNavigate } from '../../routes'
import { useAccountStore } from '../../store'

type RangeFromZeroToN<
  N extends number,
  T extends number[] = []
> = T['length'] extends N ? T[number] : RangeFromZeroToN<N, [...T, T['length']]>;

// type Range<From extends number, To extends number> = Exclude<
//   RangeFromZeroToN<To>,
//   RangeFromZeroToN<From>
// >;

type Inputs<Size extends number> = {
  [K in RangeFromZeroToN<Size>]: string;
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

const MNEMONIC_PHRASE_LENGTH = 12

export const ImportWallet: React.FC = () => {
  const navigate = useNavigate()
  const importWallet = useAccountStore(state => state.importWallet)
  const selection = useSelection(MNEMONIC_PHRASE_LENGTH + 1, 'tab', 'return')
  const { data, register, errors, isValid } = useForm<Inputs<typeof MNEMONIC_PHRASE_LENGTH>>({
    rules: {
      ...Array.from(new Array(MNEMONIC_PHRASE_LENGTH)).reduce((obj, _, index) => ({
        ...obj,
        [index]: lengthRule(1, 20)
      }), {})
    }
  })

  const onImport = () => {
    if (!isValid) {
      return
    }

    // try to import
    const phrase = Object.values(data).join(' ')
    importWallet(phrase)
    // save to store

    navigate(ROUTE.REGISTRATION_PASSWORD)
  }

  const seed = generateSeedObject(MNEMONIC_PHRASE_LENGTH)

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
                  <Box
                    key={key}
                    flexDirection="row"
                    borderStyle="classic"
                    width="30"
                    borderColor={errors[key] && errors[key].length && 'red'}
                  >
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
        selectKey="return"
        isFocused={selection === MNEMONIC_PHRASE_LENGTH}
        onPress={onImport}
      >
        Import wallet
      </Button>
    </Box>
  )
}
