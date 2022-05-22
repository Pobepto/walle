import { Key, Box, BoxProps, Text } from 'ink'
import Spinner from 'ink-spinner'
import React from 'react'
import { AnyFunction } from 'tsdef'
import type { SpinnerName } from 'cli-spinners'
import { useKey } from '@hooks'

export interface ButtonProps extends BoxProps {
  children: React.ReactNode
  onPress: AnyFunction
  isFocused: boolean
  isDisabled?: boolean
  isLoading?: boolean
  spinner?: SpinnerName
  selectKey?: keyof Key
}

export const Button: React.FC<ButtonProps> = (props) => {
  const {
    children,
    selectKey = 'return',
    onPress,
    isFocused,
    isDisabled,
    isLoading,
    spinner = 'dots',
    ...boxProps
  } = props

  const disabled = isDisabled || isLoading

  useKey(selectKey, onPress, isFocused && !disabled)

  const text =
    typeof children === 'function' ? (children as any)(props) : children

  return (
    <Box
      justifyContent="center"
      borderStyle={isFocused ? 'bold' : 'single'}
      {...boxProps}
    >
      {isLoading ? (
        <Spinner type={spinner} />
      ) : typeof text === 'string' ? (
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
