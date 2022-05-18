import React from 'react'
import { Box } from 'ink'
import { useInput } from '../hooks'

interface Props {
  children: React.ReactNode
}

export const WelcomeLayout: React.FC<Props> = ({ children }) => {
  useInput(() => null)

  return (
    <Box
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      width="100%"
    >
      {children}
    </Box>
  )
}
