import { Box, Text } from 'ink'
import React from 'react'
import { Error, Input, InputProps } from '.'

interface Props extends InputProps {
  label?: string
  error?: string
}

export const InputBox: React.FC<Props> = ({
  label,
  error,
  focus = false,
  ...inputProps
}) => {
  return (
    <Box borderStyle="classic" flexDirection="column">
      <Box>
        {label ? <Text>{label}: </Text> : null}
        <Input focus={focus} {...inputProps} />
      </Box>
      {error ? <Error text={error} /> : null}
    </Box>
  )
}
