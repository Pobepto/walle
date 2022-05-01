import { Box, Text } from 'ink'

import React, { useState } from 'react'
import { Input } from '../../components'
import { useSelection } from '../../hooks/useSelection'

const getSeed = (wordLen: number) => {
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
  const selection = useSelection(12, 'tab', 'return')
  const [seeds, setSeeds] = useState({
    0: '',
    1: '',
    2: '',
    3: '',
    4: '',
    5: '',
    6: '',
    7: '',
    8: '',
    9: '',
    10: '',
    11: ''
  })

  const seed = getSeed(12)

  const onInputChange = (e, key) => setSeeds(prev => ({ ...prev, [key]: e }))

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
                      value={seeds[key]}
                      onChange={(e) => onInputChange(e, key)}
                      focus={selection === key}
                    />
                  </Box>
                )
              })}
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
