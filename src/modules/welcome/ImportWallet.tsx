import { Box, Text } from 'ink'

import React, { useMemo, useState } from 'react'
import { Button, Input, Error } from '../../components'
import { useClipboard, lengthRule, useForm, useKey, useSelection } from '../../hooks'
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
  const [error, setError] = useState('')

  const { data, register, errors, isValid, setData } = useForm<Inputs>({
    rules: Object.fromEntries(
      Array.from(Array(MNEMONIC_PHRASE_LENGTH), (_, index) => [index, lengthRule(1, 20)])
    )
  })

  useClipboard((clipboard) => {
    const words = clipboard.split(' ')
    if (words.length !== MNEMONIC_PHRASE_LENGTH) return

    setData(Object.fromEntries(
      Array.from(
        Array(MNEMONIC_PHRASE_LENGTH),
        (_, index) => [index, words[index]]
      )
    ))
  })

  useKey('downArrow', () => select(MNEMONIC_PHRASE_LENGTH))
  useKey('upArrow', () => select(0), selection === MNEMONIC_PHRASE_LENGTH)

  const onImport = () => {
    if (!isValid) {
      return
    }

    try {
      const phrase = Object.values(data).join(' ')
      importWallet(phrase)
      navigate(ROUTE.REGISTRATION_PASSWORD)
    } catch (err) {
      setError(err.message)
    }
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
      <Error text={error} />
      <Button
        width="50%"
        alignSelf='center'
        isFocused={selection === MNEMONIC_PHRASE_LENGTH}
        onPress={onImport}
      >
        Import wallet
      </Button>
    </Box>
  )
}
