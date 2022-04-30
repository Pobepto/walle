import React from 'react'
import { Box } from 'ink'
import { useInput } from '../hooks/useInput'

interface Props {
  children: React.ReactNode
}

export const WelcomeLayout: React.FC<Props> = ({ children }) => {
  useInput(() => null)

  return (
    <Box flexDirection="column" justifyContent="center" alignItems="center">
      {children}
    </Box>
  )
}