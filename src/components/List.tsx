import { Text } from 'ink'
import React from 'react'

interface ListProps {
  children: React.ReactNode | React.ReactNode[]
  selection: number
}

export const List: React.FC<ListProps> = ({
  children: _children,
  selection,
}) => {
  const children = React.Children.toArray(_children)
  const viewport = 3

  return (
    <>
      {selection >= viewport && <Text>▲</Text>}
      {children.map((child, index) => {
        let isRender = false

        // TODO: fix
        if (selection > index - viewport && selection < index + viewport) {
          isRender = true
        }

        return isRender ? child : null
      })}
      {selection < children.length - viewport && <Text>▼</Text>}
    </>
  )
}
