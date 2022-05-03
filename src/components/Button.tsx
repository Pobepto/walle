import { Text, Key, TextProps } from 'ink'

import React from 'react'
import { AnyFunction } from 'tsdef'
import { useInput } from '../hooks/useInput'

interface Props extends TextProps {
  children: React.ReactNode;
  selectKey: keyof Key;
  onPress: AnyFunction;
  isFocused: boolean;
}

export const Button: React.FC<Props> = ({ children, selectKey, onPress, isFocused, ...props }) => {
  useInput(key => {
    if (key[selectKey]) {
      onPress()
    }
  }, isFocused)

  return <Text {...props} bold={isFocused}>{children}</Text>
}
