import React, { cloneElement, isValidElement } from 'react'
import { useSelectionZone } from './SelectionZone'

type Props = React.PropsWithChildren<{
  activeProps?: Record<string, unknown>
  index?: number
  children: React.ReactNode | React.ReactNode[] | ((isFocused: boolean) => any)
}>

export const Selection: React.FC<Props> = ({
  children,
  index,
  activeProps,
}) => {
  const zone = useSelectionZone()

  if (zone) {
    const isActive = zone.isActive && zone.selection === index

    if (isActive) {
      if (typeof children === 'function') {
        return children(isActive)
      }

      if (isValidElement(children)) {
        return cloneElement(children, {
          ...children.props,
          ...activeProps,
        })
      }
    }
  }

  return <>{children}</>
}
