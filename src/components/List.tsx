import { SelectionSettings } from '@src/hooks'
import { Text } from 'ink'
import React, { useState } from 'react'
import { Selection, SelectionZone } from './SelectionZone'

interface ListProps extends Omit<SelectionSettings, 'amount'> {
  children: React.ReactNode | React.ReactNode[]
  activeProps: Record<string, unknown>
}

// WIP
export const List: React.FC<ListProps> = ({
  children: _children,
  activeProps,
  ...props
}) => {
  const children = React.Children.toArray(_children)
  const [selection, setSelection] = useState(0)
  const viewport = 3

  return (
    <SelectionZone onChange={(selection) => setSelection(selection)} {...props}>
      {selection >= viewport && <Text>▲</Text>}
      {children.map((child, index) => {
        // const isRender = index >= selection - 1 && index <= selection + 1
        let isRender = false

        // if (index <= viewport && selection <= viewport - 1) {
        //   isRender = true
        // }

        if (selection > index - viewport && selection < index + viewport) {
          isRender = true
        }

        return (
          <Selection key={index} activeProps={activeProps}>
            {isRender ? child : null}
          </Selection>
        )
      })}
      {selection < children.length - viewport && <Text>▼</Text>}
    </SelectionZone>
  )
}
