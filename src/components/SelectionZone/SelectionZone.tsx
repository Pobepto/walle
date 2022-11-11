import { useSelection } from '@src/hooks'
import { Key } from 'ink'
import React, {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useEffect,
} from 'react'
import { Nullable } from 'tsdef'
import { Selection } from './Selection'

export interface IZone {
  selection: number
  select: (value: number) => void
  isActive: boolean
}

const SelectionContext = createContext<Nullable<IZone>>(null)

export const useSelectionZone = () => useContext(SelectionContext)

type Props = React.PropsWithChildren<{
  prevKey: keyof Key | (keyof Key)[]
  nextKey: keyof Key | (keyof Key)[]
  isActive?: boolean
  looped?: boolean
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

export const SelectionZone: React.FC<Props> = ({
  children,
  prevKey,
  nextKey,
  isActive = false,
  looped,
  onChange,
}) => {
  const { newChildren, amount } = iterateChildren(children)

  const [selection, select] = useSelection(
    amount,
    prevKey,
    nextKey,
    isActive,
    looped,
  )

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
