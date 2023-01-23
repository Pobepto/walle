import React, { useMemo, useState } from 'react'
import { Box, Text } from 'ink'

import { Button, ButtonProps, Error, Input, InputProps } from '@components'
import { length, useClipboard, useForm } from '@hooks'
import { ROUTE, useNavigate } from '@routes'
import {
  Selection,
  SelectionZone,
  SelectionZoneProps,
} from '@src/components/SelectionZone'
import { useWalletStore } from '@store'

type Inputs = {
  [key: number]: string
}

const generateSeedObject = (wordLen: number) => {
  const wordInRow = 4
  const rows = wordLen / wordInRow
  const result = Array<{ key: number; text: string }[]>(rows)
    .fill(Array(wordInRow).fill({}))
    .map((row, rowIndex) =>
      row.map((_, index) => ({
        key: index + rowIndex * wordInRow,
        text: `${index + rowIndex * wordInRow + 1}.`,
      })),
    )

  return result
}

const MNEMONIC_LENGTHS = [12, 16, 24]

export const ImportWallet: React.FC = () => {
  const [phraseLength, setPhraseLength] = useState(0)

  if (phraseLength === 0) {
    return (
      <Box
        flexDirection="column"
        width="100%"
        borderStyle="single"
        paddingX={1}
      >
        <Box>
          <Text>Import</Text>
        </Box>
        <SelectionZone prevKey="leftArrow" nextKey="rightArrow" isActive>
          <Box justifyContent="center">
            {MNEMONIC_LENGTHS.map((length) => (
              <Selection<ButtonProps>
                key={length}
                activeProps={{ isFocused: true }}
              >
                <Button width="20%" onPress={() => setPhraseLength(length)}>
                  <Text>{length}</Text>
                </Button>
              </Selection>
            ))}
          </Box>
        </SelectionZone>
      </Box>
    )
  }

  return <ImportWalletPhrase phraseLength={phraseLength} />
}

const ImportWalletPhrase: React.FC<{ phraseLength: number }> = ({
  phraseLength,
}) => {
  const navigate = useNavigate()
  const importWallet = useWalletStore((state) => state.importWallet)
  const [error, setError] = useState('')

  const { data, register, errors, isValid, setData } = useForm<Inputs>({
    rules: Object.fromEntries(
      Array.from(Array(phraseLength), (_, index) => [index, length(1, 20)]),
    ),
  })

  useClipboard((clipboard) => {
    const words = clipboard.split(' ')

    setData(
      Object.fromEntries(
        Array.from(Array(phraseLength), (_, index) => [
          index,
          words[index] ?? '',
        ]),
      ),
    )
  })

  const onImport = () => {
    try {
      const phrase = Object.values(data).join(' ')
      importWallet(phrase)
      navigate(ROUTE.REGISTRATION_PASSWORD)
    } catch (err: any) {
      setError(err?.message)
    }
  }

  const seed = useMemo(() => generateSeedObject(phraseLength), [])

  return (
    <Box flexDirection="column" width="100%" borderStyle="single" paddingX={1}>
      <Box>
        <Text>Import</Text>
      </Box>
      <SelectionZone prevKey="upArrow" nextKey="downArrow" isActive>
        <Selection<SelectionZoneProps> activeProps={{ isActive: true }}>
          <SelectionZone prevKey="tab" nextKey="return">
            <Box flexDirection="column">
              {seed.map((row, index) => {
                return (
                  <Box
                    key={`row-${index}`}
                    flexDirection="row"
                    alignItems="center"
                  >
                    {row.map(({ key, text }) => {
                      return (
                        <Box
                          key={key}
                          flexDirection="row"
                          borderStyle="classic"
                          width="30"
                          borderColor={
                            errors[key] && errors[key]!.length ? 'red' : ''
                          }
                        >
                          <Text>{text}</Text>
                          <Selection<InputProps> activeProps={{ focus: true }}>
                            <Input {...register(key)} focus={false} />
                          </Selection>
                        </Box>
                      )
                    })}
                  </Box>
                )
              })}
            </Box>
            <Error text={error} />
          </SelectionZone>
        </Selection>
        <Selection<ButtonProps> activeProps={{ isFocused: true }}>
          <Button
            width="50%"
            alignSelf="center"
            isDisabled={!isValid}
            onPress={onImport}
          >
            Import wallet
          </Button>
        </Selection>
      </SelectionZone>
    </Box>
  )
}
