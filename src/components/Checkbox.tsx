import React from 'react'
import { Box, Text } from 'ink'

import { useInput } from '@src/hooks'

export interface CheckboxProps {
  label: string
  onChange: (value: string) => void
  value: string
  isFocused?: boolean
  checkedSymbol?: string
  uncheckedSymbol?: string
  onFocus?: () => void
  onBlur?: () => void
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  onChange,
  value,
  isFocused = false,
  checkedSymbol = '✅',
  uncheckedSymbol = '❌',
}) => {
  useInput(({ key }) => {
    if (key.return) {
      onChange(!value ? '1' : '')
    } else if (key.rightArrow) {
      onChange('1')
    } else if (key.leftArrow) {
      onChange('')
    }
  }, isFocused)

  return (
    <Box>
      <Text bold={isFocused}>{label}</Text>
      <Text>{value ? checkedSymbol : uncheckedSymbol}</Text>
    </Box>
  )
}
