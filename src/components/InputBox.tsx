import { useInput } from '@src/hooks'
import { Box, Text } from 'ink'
import Spinner from 'ink-spinner'
import React from 'react'
import { Error, Input, InputProps } from '.'

export interface InputBoxProps extends InputProps {
  label?: string
  type?: 'text' | 'number'
  error?: string
  loading?: boolean
  postfix?: string
}

export const InputBox: React.FC<InputBoxProps> = ({
  label,
  error,
  type = 'text',
  focus = false,
  loading = false,
  postfix = '',
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

  useInput(({ key }) => {
    if (key.ctrl && (key.backspace || key.delete)) {
      process.nextTick(() => onChange(''))
    }
  }, focus)

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
        {!loading && postfix ? <Text>{postfix}</Text> : null}
      </Box>
      {error ? <Error text={error} /> : null}
    </Box>
  )
}
