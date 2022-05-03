import { Box, Text } from 'ink'

import React from 'react'
import { Button, Input } from '../../components'
import { useForm } from '../../hooks/useForm'
import { useSelection } from '../../hooks/useSelection'
import { ROUTE, useNavigate } from '../../routes'

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
  const { register } = useForm<Inputs>({
    0: 'sun'
  })
  const seed = generateSeedObject(12)

  return (
    <Box flexDirection="column">
      <Box>
        <Text>Import</Text>
      </Box>
      <Box flexDirection="column">
        {seed.map((row, index) => {
          return (
            <Box key={`row-${index}`} flexDirection="row">
              {row.map(({ key, text }) => {
                return (
                  <Box key={key} flexDirection="row" borderStyle="classic" width="20">
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
        onPress={() => navigate(ROUTE.REGISTRATION_PASSWORD)}
      >
        Import wallet
      </Button>
    </Box>
  )
}
