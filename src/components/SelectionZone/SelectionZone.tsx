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

const SelectionContext = createContext<
  Nullable<{
    selection: number
  }>
>(null)

export const useSelectionZone = () => useContext(SelectionContext)

type Props = React.PropsWithChildren<{
  prevKey: keyof Key | (keyof Key)[]
  nextKey: keyof Key | (keyof Key)[]
  isActive?: boolean
  looped?: boolean
  onChange?: (selection: number) => void
}>

const iterateChildren = (children: React.ReactNode) => {
  let index = 0

  const newChildren = Children.map(children, (child) => {
    if (isValidElement(child) && child.type === Selection) {
      return cloneElement(child, {
        index: index++,
      })
    }

    return child
  })

  return { newChildren, amount: index }
}

export const SelectionZone: React.FC<Props> = ({
  children,
  prevKey,
  nextKey,
  isActive = true,
  looped = false,
  onChange,
}) => {
  const { newChildren, amount } = iterateChildren(children)

  const [selection] = useSelection(amount, prevKey, nextKey, isActive, looped)

  useEffect(() => {
    onChange && onChange(selection)
  }, [selection])

  return (
    <SelectionContext.Provider
      value={{
        selection,
      }}
    >
      {newChildren}
    </SelectionContext.Provider>
  )
}
