import { SelectionSettings, useSelection } from '@src/hooks'
import React, {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useState,
} from 'react'
import { FocusZone } from './FocusZone'
import { Selection } from './Selection'
import { SelectionContext } from './SelectionContext'

export type SelectionZoneProps = Omit<SelectionSettings, 'amount'> &
  React.PropsWithChildren<{
    onChange?: (selection: number) => void
    onChangeFocusZone?: (focusZone?: FocusZoneInfo) => void
  }>

export type UncontrolledSelectionZoneProps = React.PropsWithChildren<{
  selection: number
  select: (selection: number) => void
  isActive?: boolean
  onChangeAmount: (amount: number) => void
  onChangeFocusZone?: (focusZone?: FocusZoneInfo) => void
}>

export interface FocusZoneInfo {
  id: string
  from: number
  to: number
}

const iterateChildren = (children: React.ReactNode) => {
  const focusZones: Record<string, FocusZoneInfo> = {}
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
        if (type === FocusZone) {
          focusZones[props.id] = {
            id: props.id,
            from: amount,
          } as any
        }

        const elements = cloneElement(child, {
          ...props,
          children: iterateAndClone(props.children),
        })

        if (type === FocusZone) {
          focusZones[props.id].to = amount - 1
        }

        return elements
      }

      return child
    })
  }

  const newChildren = iterateAndClone(children)

  return { newChildren, amount, focusZones }
}

export const UncontrolledSelectionZone: React.FC<
  UncontrolledSelectionZoneProps
> = ({
  children,
  selection,
  select,
  isActive = false,
  onChangeAmount,
  onChangeFocusZone,
}) => {
  const { newChildren, amount, focusZones } = iterateChildren(children)

  useEffect(() => {
    if (onChangeFocusZone) {
      const [, focusZone] =
        Object.entries(focusZones).find(([, range]) => {
          return selection >= range.from && selection <= range.to
        }) ?? []

      onChangeFocusZone(focusZone)
    }
  }, [selection])

  useEffect(() => {
    onChangeAmount(amount)
  }, [amount])

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

export const SelectionZone: React.FC<SelectionZoneProps> = ({
  children,
  defaultSelection,
  prevKey,
  nextKey,
  isActive = false,
  looped,
  onChangeFocusZone,
}) => {
  const [amount, setAmount] = useState(1)
  const [selection, select] = useSelection({
    amount,
    defaultSelection,
    nextKey,
    prevKey,
    isActive,
    looped,
  })

  return (
    <UncontrolledSelectionZone
      selection={selection}
      select={select}
      isActive={isActive}
      onChangeAmount={setAmount}
      onChangeFocusZone={onChangeFocusZone}
    >
      {children}
    </UncontrolledSelectionZone>
  )
}
