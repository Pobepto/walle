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

interface Props extends InkTextProps {}

export const Input: React.FC<Props> = ({ ...props }) => {
  return <InkTextInput {...props} />
}
