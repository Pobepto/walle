import { Box, Text } from 'ink'
import Spinner from 'ink-spinner'
import React from 'react'
import { Error, Input, InputProps } from '.'

interface Props extends InputProps {
  label?: string
  type?: 'text' | 'number'
  error?: string
  loading?: boolean
}

export const InputBox: React.FC<Props> = ({
  label,
  error,
  type = 'text',
  focus = false,
  loading = false,
  onChange,
  ...inputProps
}) => {
  const disabled = inputProps.disabled || loading

  const handleChange = (value: string) => {
    if (type === 'number') {
      value = value.replace(',', '.')
    }

    onChange(value)
  }

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
        <Input
          focus={focus}
          disabled={disabled}
          onChange={handleChange}
          {...inputProps}
        />
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
