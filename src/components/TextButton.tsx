import { TextProps, Text } from 'ink'
import React from 'react'
import { AnyFunction } from 'tsdef'
import { SuperKey, useKey } from '@hooks'

export interface TextButtonProps extends TextProps {
  children: React.ReactNode
  onPress: AnyFunction
  isFocused?: boolean
  selectKey?: SuperKey | SuperKey[]
}

export const TextButton: React.FC<TextButtonProps> = ({
  children,
  selectKey = 'return',
  onPress,
  isFocused,
  ...props
}) => {
  useKey(selectKey, onPress, isFocused)

  return (
    <Text {...props} bold={isFocused}>
      {children}
    </Text>
  )
}
