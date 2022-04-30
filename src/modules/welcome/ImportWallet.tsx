import { Box, Text } from 'ink'

import React from 'react'
import { Input } from '../../components'
import { useSelection } from '../../hooks/useSelection'

export const ImportWallet: React.FC = () => {
  const selection = useSelection(12, 'leftArrow', 'rightArrow')

  return (
    <Box flexDirection="column">
      <Box>
        <Text>Import</Text>
      </Box>
      <Box flexDirection="column">
        <Box flexDirection="row">
          <Box flexDirection="row" borderStyle="classic" width="20">
            <Text>1. </Text>
            <Input value="" onChange={(e) => console.log(e)} focus={selection === 0} />
          </Box>
          <Box flexDirection="row" borderStyle="classic" width="20">
            <Text>2. </Text>
            <Input value="" onChange={(e) => console.log(e)} focus={selection === 1} />
          </Box>
          <Box flexDirection="row" borderStyle="classic" width="20">
            <Text>3. </Text>
            <Input value="" onChange={(e) => console.log(e)} focus={selection === 2} />
          </Box>
          <Box flexDirection="row" borderStyle="classic" width="20">
            <Text>4. </Text>
            <Input value="" onChange={(e) => console.log(e)} focus={selection === 3} />
          </Box>
        </Box>
        <Box flexDirection="row">
          <Box flexDirection="row" borderStyle="classic" width="20">
            <Text>5. </Text>
            <Input value="" onChange={(e) => console.log(e)} focus={selection === 4} />
          </Box>
          <Box flexDirection="row" borderStyle="classic" width="20">
            <Text>6. </Text>
            <Input value="" onChange={(e) => console.log(e)} focus={selection === 5} />
          </Box>
          <Box flexDirection="row" borderStyle="classic" width="20">
            <Text>7. </Text>
            <Input value="" onChange={(e) => console.log(e)} focus={selection === 6} />
          </Box>
          <Box flexDirection="row" borderStyle="classic" width="20">
            <Text>8. </Text>
            <Input value="" onChange={(e) => console.log(e)} focus={selection === 7} />
          </Box>
        </Box>
        <Box flexDirection="row">
          <Box flexDirection="row" borderStyle="classic" width="20">
            <Text>9. </Text>
            <Input value="" onChange={(e) => console.log(e)} focus={selection === 8} />
          </Box>
          <Box flexDirection="row" borderStyle="classic" width="20">
            <Text>10. </Text>
            <Input value="" onChange={(e) => console.log(e)} focus={selection === 9} />
          </Box>
          <Box flexDirection="row" borderStyle="classic" width="20">
            <Text>11. </Text>
            <Input value="" onChange={(e) => console.log(e)} focus={selection === 10} />
          </Box>
          <Box flexDirection="row" borderStyle="classic" width="20">
            <Text>12. </Text>
            <Input value="" onChange={(e) => console.log(e)} focus={selection === 11} />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
