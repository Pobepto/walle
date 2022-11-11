import InkTextInput from 'ink-text-input'
import React from 'react'
import { useDidMountEffect } from '@hooks'

interface InkTextInputProps {
  placeholder?: string
  focus?: boolean
  mask?: string
  showCursor?: boolean
  highlightPastedText?: boolean
  value: string
  onChange: (value: string) => void
  onSubmit?: (value: string) => void
}

export interface InputProps extends InkTextInputProps {
  onFocus?: () => void
  onBlur?: () => void
  disabled?: boolean
}

export const Input: React.FC<InputProps> = ({
  onFocus,
  onBlur,
  onChange,
  disabled,
  ...props
}) => {
  const { focus } = props

  useDidMountEffect(() => {
    if (focus) {
      onFocus && onFocus()
    } else {
      onBlur && onBlur()
    }
  }, [focus])

  return (
    <InkTextInput
      onChange={(value) => {
        if (!disabled) {
          onChange(value)
        }
      }}
      {...props}
    />
  )
}
