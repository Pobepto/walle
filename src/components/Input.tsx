import InkTextInput from 'ink-text-input'
import React from 'react'
import { useDidMountEffect } from '@hooks'

interface InkTextProps {
  placeholder?: string
  focus?: boolean
  mask?: string
  showCursor?: boolean
  highlightPastedText?: boolean
  value: string
  onChange: (value: string) => void
  onSubmit?: (value: string) => void
}

export interface InputProps extends InkTextProps {
  onFocus?: () => void
  onBlur?: () => void
}

export const Input: React.FC<InputProps> = ({ onFocus, onBlur, ...props }) => {
  const { focus } = props

  useDidMountEffect(() => {
    if (focus) {
      onFocus && onFocus()
    } else {
      onBlur && onBlur()
    }
  }, [focus])

  return <InkTextInput {...props} />
}
