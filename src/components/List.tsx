import { Text } from 'ink'
import React from 'react'

interface ListProps {
  children: React.ReactNode | React.ReactNode[]
  selection: number
  viewport: number
  upArrow?: string
  downArrow?: string
}

export const List: React.FC<ListProps> = ({
  children: _children,
  selection,
  viewport,
  upArrow = '▲',
  downArrow = '▼',
}) => {
  const children = React.Children.toArray(_children)
  const doubleViewport = viewport * 2
  const childrenLength = children.length - 1

  return (
    <>
      {selection > viewport && <Text>{upArrow}</Text>}
      {children.map((child, index) => {
        let isRender = false

        // middle sector
        if (index >= selection - viewport && index <= selection + viewport) {
          isRender = true
        }

        // top\bottom sectors
        if (selection < viewport && index <= doubleViewport) {
          isRender = true
        } else if (
          selection > childrenLength - viewport &&
          index >= childrenLength - doubleViewport
        ) {
          isRender = true
        }

        return isRender ? child : null
      })}
      {selection < childrenLength - viewport && <Text>{downArrow}</Text>}
    </>
  )
}
