import React from 'react'
import { Box } from 'ink'

interface Props {
  children: React.ReactNode
}

export const WelcomeLayout: React.FC<Props> = ({ children }) => {
  return (
    <Box flexDirection="column">
      {children}
    </Box>
  )
}
