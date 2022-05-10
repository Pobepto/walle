import { Box, Text } from 'ink'

import React, { useMemo } from 'react'
import { Button, Input } from '../../components'
import { lengthRule, useForm } from '../../hooks/useForm'
import { useKey } from '../../hooks/useKey'
import { useSelection } from '../../hooks/useSelection'
import { ROUTE, useNavigate } from '../../routes'
import { useAccountStore } from '../../store'

type Inputs = {
  [key: number]: string;
}

const generateSeedObject = (wordLen: number) => {
  const wordInRow = 4
  const rows = wordLen / wordInRow
  const result = Array<{ key: number, text: string }[]>(rows)
    .fill(Array(wordInRow).fill({}))
    .map(
      (row, rowIndex) => row.map(
        (_, index) => ({
          key: index + (rowIndex * wordInRow),
          text: `${index + (rowIndex * wordInRow) + 1}.`
        })
      )
    )

  return result
}

const MNEMONIC_PHRASE_LENGTH = 12

export const ImportWallet: React.FC = () => {
  const navigate = useNavigate()
  const importWallet = useAccountStore(state => state.importWallet)
  const [selection, select] = useSelection(MNEMONIC_PHRASE_LENGTH + 1, 'tab', 'return')

  const { data, register, errors, isValid } = useForm<Inputs>({
    rules: Object.fromEntries(
      Array.from(Array(MNEMONIC_PHRASE_LENGTH), (_, index) => [index, lengthRule(1, 20)])
    )
  })

  useKey('downArrow', () => select(MNEMONIC_PHRASE_LENGTH))
  useKey('upArrow', () => select(0), selection === MNEMONIC_PHRASE_LENGTH)

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

  const seed = useMemo(() => generateSeedObject(MNEMONIC_PHRASE_LENGTH), [])

  return (
    <Box flexDirection="column" width="100%">
      <Box>
        <Text>Import</Text>
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
      <Box justifyContent='center' borderStyle={selection === MNEMONIC_PHRASE_LENGTH ? 'bold' : 'single'}>
        <Button
          selectKey="return"
          isFocused={selection === MNEMONIC_PHRASE_LENGTH}
          onPress={onImport}
        >
          Import wallet
        </Button>
      </Box>
    </Box>
  )
}
