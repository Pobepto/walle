import { Text, TextProps } from 'ink'
import React from 'react'

interface Props extends TextProps {
  text: string
}

export const Error: React.FC<Props> = ({ text, ...props }) => {
  return (
    <Text {...props} color="red">
      {text}
    </Text>
  )
}
