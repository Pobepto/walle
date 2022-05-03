import InkTextInput from 'ink-text-input'
import React from 'react'
import { useDidMountEffect } from '../hooks/useDidMountEffect'

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
  onFocus?: () => void;
  onBlur?: () => void;
}

export const Input: React.FC<Props> = ({ onFocus, onBlur, ...props }) => {
  const { focus } = props

  useDidMountEffect(() => {
    if (focus) {
      onFocus()
    } else {
      onBlur()
    }
  }, [focus])

  return <InkTextInput {...props} />
}
