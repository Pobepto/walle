import { Box, BoxProps, Text } from 'ink'
import React from 'react'
import { AnyFunction } from 'tsdef'
import type { SpinnerName } from 'cli-spinners'
import { SuperKey, useKey } from '@hooks'
import { Loader } from './Loader'

export interface ButtonProps extends BoxProps {
  children: React.ReactNode
  onPress: AnyFunction
  isFocused?: boolean
  isDisabled?: boolean
  isLoading?: boolean
  spinner?: SpinnerName
  selectKey?: SuperKey | SuperKey[]
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
      borderStyle={isFocused ? 'bold' : 'round'}
      {...boxProps}
    >
      <Loader loading={isLoading} type={spinner}>
        {typeof text === 'string' ? (
          <Text bold={isFocused}>{text}</Text>
        ) : (
          children
        )}
      </Loader>
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
