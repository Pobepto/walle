import InkTextInput from 'ink-text-input'
import React, { useEffect } from 'react'
import { AnyFunction } from 'tsdef'

interface InkTextProps {
  placeholder?: string;
  focus?: boolean;
  mask?: string;
  showCursor?: boolean;
  highlightPastedText?: boolean;
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
}

interface Props extends InkTextProps {
  onFocus?: AnyFunction;
  onBlur?: AnyFunction;
}

export const Input: React.FC<Props> = ({ onFocus, onBlur, ...props }) => {
  useEffect(() => {
    onFocus && onFocus()
    return () => {
      onBlur && onBlur()
    }
  }, [onFocus, onBlur])

  return <InkTextInput {...props} />
}
