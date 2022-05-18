import React, { useState } from 'react'
import { MaybePromise } from 'tsdef'
import { Button, ButtonProps } from '.'

export interface AsyncButtonProps extends Omit<ButtonProps, 'onPress'> {
  onPress: () => MaybePromise<unknown>
}

const AsyncButton: React.FC<AsyncButtonProps> = ({
  children,
  onPress,
  ...props
}) => {
  const [disabledByPromise, setDisabledByPromise] = useState(false)

  const asyncOnPress = async () => {
    setDisabledByPromise(true)
    try {
      await onPress()
    } finally {
      setDisabledByPromise(false)
    }
  }

  return (
    <Button
      {...props}
      isLoading={disabledByPromise || props.isLoading}
      onPress={asyncOnPress}
    >
      {children}
    </Button>
  )
}

export default AsyncButton
