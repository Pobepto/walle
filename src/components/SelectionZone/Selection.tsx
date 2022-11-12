import React, { cloneElement, isValidElement } from 'react'
import { useSelectionZone } from './SelectionContext'

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

// WIP
export const selectionable = <T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  activeProps?: Partial<T>,
) => {
  const SelectionableComponent: React.FC<T> = (props) => {
    return (
      <Selection activeProps={activeProps}>
        <Component {...props} />
      </Selection>
    )
  }

  return SelectionableComponent
}
