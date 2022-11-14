import React, { useState } from 'react'
import { Selection, SelectionZone } from './SelectionZone'

interface ListProps {
  children: React.ReactNode | React.ReactNode[]
}

// WIP
export const List: React.FC<ListProps> = ({ children }) => {
  const [selection, setSelection] = useState(0)

  return (
    <SelectionZone
      prevKey="upArrow"
      nextKey="downArrow"
      onChange={(selection) => setSelection(selection)}
      isActive
    >
      {React.Children.map(children, (child, index) => {
        return (
          <Selection key={index} activeProps={{ isFocused: true }}>
            {index >= selection - 1 && index <= selection + 1 ? child : null}
          </Selection>
        )
      })}
    </SelectionZone>
  )
}
