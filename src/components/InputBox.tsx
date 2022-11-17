import { Box, Text } from 'ink'
import Spinner from 'ink-spinner'
import React from 'react'
import { Error, Input, InputProps } from '.'

interface Props extends InputProps {
  label?: string
  error?: string
  loading?: boolean
}

export const InputBox: React.FC<Props> = ({
  label,
  error,
  focus = false,
  loading = false,
  ...inputProps
}) => {
  const disabled = inputProps.disabled || loading

  return (
    <Box
      borderStyle="classic"
      borderColor={disabled ? 'grey' : undefined}
      flexDirection="column"
    >
      <Box>
        {label ? (
          <Text color={disabled ? 'grey' : undefined}>{label}: </Text>
        ) : null}
        <Input focus={focus} disabled={disabled} {...inputProps} />
        {loading ? (
          <Box marginLeft={1}>
            <Spinner />
          </Box>
        ) : null}
      </Box>
      {error ? <Error text={error} /> : null}
    </Box>
  )
}
