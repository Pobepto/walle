import { Text, Key, TextProps } from 'ink'
import React from 'react'
import { useKey } from '@hooks/useKey'
import { ROUTE, useNavigate } from '@routes'

interface Props extends TextProps {
  children: React.ReactNode
  isFocused: boolean
  to: ROUTE
  selectKey?: keyof Key
}

export const Link: React.FC<Props> = ({
  children,
  selectKey = 'return',
  isFocused,
  to,
  ...props
}) => {
  const navigate = useNavigate()

  useKey(
    selectKey,
    () => {
      navigate(to)
    },
    isFocused,
  )

  return (
    <Text {...props} bold={isFocused}>
      {children}
    </Text>
  )
}
