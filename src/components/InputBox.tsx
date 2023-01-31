import React from 'react'
import { Boxes } from 'cli-boxes'
import { Box, Text } from 'ink'
import Spinner from 'ink-spinner'

import { useInput } from '@src/hooks'
import { isNumeric } from '@src/utils/isNumeric'

import { Error, Input, InputProps } from '.'

export interface InputBoxProps extends InputProps {
  label?: string
  type?: 'text' | 'number'
  error?: string
  loading?: boolean
  postfix?: string
  width?: string | number
  borderStyle?: keyof Boxes
}

export const InputBox: React.FC<InputBoxProps> = ({
  label,
  error,
  type = 'text',
  focus = false,
  loading = false,
  postfix = '',
  width,
  onChange,
  borderStyle = 'classic',
  ...inputProps
}) => {
  const disabled = inputProps.disabled || loading

  const handleChange = (value: string) => {
    if (type === 'number') {
      value = value.replace(',', '.')

      if (value && !isNumeric(value)) {
        return
      }
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
      borderStyle={borderStyle}
      borderColor={disabled ? 'grey' : undefined}
      flexDirection="column"
      width={width}
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
      {!loading && error ? <Error text={error} /> : null}
    </Box>
  )
}
