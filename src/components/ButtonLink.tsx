import { ROUTE, useNavigate } from '@src/routes'
import React from 'react'
import { Button, ButtonProps } from './Button'

interface ButtonLinkProps extends Omit<ButtonProps, 'onPress'> {
  to: ROUTE
}

export const ButtonLink: React.FC<ButtonLinkProps> = ({
  to,
  children,
  ...props
}) => {
  const navigate = useNavigate()

  return (
    <Button {...props} onPress={() => navigate(to)}>
      {children}
    </Button>
  )
}
