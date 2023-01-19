import React from 'react'
import { Box, Text } from 'ink'

export const Help: React.FC = () => {
  return (
    <Box display="flex" flexDirection="column">
      <Text>
        Use <Text bold>&quot;Tab&quot;</Text> to move between menus
      </Text>
      <Text>
        Use <Text bold>🔽</Text> / <Text bold>🔼</Text> to move to select inputs
        or buttons
      </Text>
    </Box>
  )
}
