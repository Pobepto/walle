import React, { cloneElement, isValidElement } from 'react'
import { useSelectionZone } from './SelectionZone'

type Props = React.PropsWithChildren<{
  activeProps?: Record<string, unknown>
  index?: number
}>

export const Selection: React.FC<Props> = ({
  children,
  index,
  activeProps,
}) => {
  const zone = useSelectionZone()

  if (zone && isValidElement(children) && zone.selection === index) {
    return cloneElement(children, {
      ...children.props,
      ...activeProps,
    })
  }

  return <>{children}</>
}
