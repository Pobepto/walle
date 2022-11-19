import React, { cloneElement, isValidElement } from 'react'
import { Nullable } from 'tsdef'
import { IZone, useSelectionZone } from './SelectionContext'

type Props<ChildProps> = {
  activeProps?: Partial<ChildProps>
  index?: number
  children:
    | React.ReactNode
    | React.ReactNode[]
    | ((isFocused: boolean, zone: Nullable<IZone>) => JSX.Element)
}

export const Selection = <ChildProps extends Record<string, any>>({
  children,
  index,
  activeProps,
}: Props<ChildProps>) => {
  const zone = useSelectionZone()

  if (zone) {
    const isActive = zone.isActive && zone.selection === index

    if (isActive) {
      if (typeof children === 'function') {
        return children(isActive, zone)
      }

      if (isValidElement(children)) {
        return cloneElement(children, {
          ...children.props,
          ...activeProps,
        })
      }
    }
  }

  if (typeof children === 'function') {
    return children(false, zone)
  }

  return <>{children}</>
}

// WIP
export const selectionable = <Props extends Record<string, any>>(
  Component: React.ComponentType<Props>,
  activeProps?: Partial<Props>,
) => {
  const SelectionableComponent: React.FC<Props> = (props) => {
    return (
      <Selection activeProps={activeProps}>
        <Component {...props} />
      </Selection>
    )
  }

  return SelectionableComponent
}
