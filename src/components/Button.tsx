import { Key, Box, BoxProps, Text } from 'ink'
import React from 'react'
import { AnyFunction } from 'tsdef'
import { useKey } from '../hooks'

interface Props extends BoxProps {
  children: React.ReactNode
  onPress: AnyFunction
  isFocused: boolean
  selectKey?: keyof Key
}

export const Button: React.FC<Props> = (props) => {
  const {
    children,
    selectKey = 'return',
    onPress,
    isFocused,
    ...boxProps
  } = props

  useKey(selectKey, onPress, isFocused)

  const text =
    typeof children === 'function' ? (children as any)(props) : children

  return (
    <Box
      justifyContent="center"
      borderStyle={isFocused ? 'bold' : 'single'}
      {...boxProps}
    >
      {typeof text === 'string' ? (
        <Text bold={isFocused}>{text}</Text>
      ) : (
        children
      )}
    </Box>
  )
}

/*
  <Button isFocused>Label</Button>

  <Button isFocused>
    <Text>Label</Text>
  </Button>

  <Button isFocused>
    {(props) => (
      <Text color={props.isFocused ? 'red' : 'black'}>Label</Text>
    )}
  </Button>
*/
