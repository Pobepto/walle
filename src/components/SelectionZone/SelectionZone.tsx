import { SelectionSettings, useSelection } from '@src/hooks'
import React, { Children, cloneElement, isValidElement, useEffect } from 'react'
import { Selection } from './Selection'
import { SelectionContext } from './SelectionContext'

type SelectionZoneProps = Omit<SelectionSettings, 'amount'> &
  React.PropsWithChildren<{
    onChange?: (selection: number) => void
  }>

const iterateChildren = (children: React.ReactNode) => {
  let amount = 0

  const iterateAndClone = (children: React.ReactNode): React.ReactNode => {
    return Children.map(children, (child) => {
      if (!isValidElement(child)) {
        return child
      }

      const { type, props } = child

      if (type === SelectionZone) {
        return child
      }

      if (type === Selection) {
        return cloneElement(child, {
          ...props,
          index: amount++,
        })
      }

      if (props.children) {
        return cloneElement(child, {
          ...props,
          children: iterateAndClone(props.children),
        })
      }

      return child
    })
  }

  const newChildren = iterateAndClone(children)

  return { newChildren, amount }
}

export const SelectionZone: React.FC<SelectionZoneProps> = ({
  children,
  defaultSelection,
  prevKey,
  nextKey,
  isActive = false,
  looped,
  onChange,
}) => {
  const { newChildren, amount } = iterateChildren(children)

  const [selection, select] = useSelection({
    amount,
    defaultSelection,
    nextKey,
    prevKey,
    isActive,
    looped,
  })

  useEffect(() => {
    onChange && onChange(selection)
  }, [selection])

  return (
    <SelectionContext.Provider
      value={{
        selection,
        select,
        isActive,
      }}
    >
      {newChildren}
    </SelectionContext.Provider>
  )
}
