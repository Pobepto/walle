import React, { useState } from 'react'
import { Box, Key } from 'ink'
import { useKey, useSelection } from '@hooks'
import { TextButton } from './TextButton'

interface MenuItem {
  title: React.ReactNode
  items?: SubMenuItem[]
  onSelect?: () => void
}

type SubMenuItem = Omit<MenuItem, 'items'>

interface Props {
  focused?: boolean
  looped?: boolean
  prevKey?: keyof Key
  nextKey?: keyof Key
  selectKey?: keyof Key
  items: MenuItem[]
}

interface PropsDrop {
  isFocused: boolean
  items: SubMenuItem[]
  onReturn: () => void
}

const NestedMenu: React.FC<PropsDrop> = ({ isFocused, onReturn, items }) => {
  useKey(['escape', 'leftArrow'], onReturn, isFocused)

  return (
    <Box marginLeft={1}>
      <Menu
        items={items}
        focused={isFocused}
        prevKey="upArrow"
        nextKey="downArrow"
      />
    </Box>
  )
}

export const Menu: React.FC<Props> = ({
  focused = true,
  looped,
  items,
  prevKey = 'leftArrow',
  nextKey = 'rightArrow',
  selectKey = 'return',
}) => {
  const [nestedMenusVisibility, setNestedMenusVisibility] = useState<
    Record<string, boolean>
  >({})

  const anyNestedMenuIsVisible = Object.values(nestedMenusVisibility).some(
    Boolean,
  )

  const [selection] = useSelection({
    amount: items.length,
    prevKey,
    nextKey,
    isActive: focused && !anyNestedMenuIsVisible,
    looped,
  })

  const openNestedMenu = (id: string) => {
    setNestedMenusVisibility({
      ...nestedMenusVisibility,
      [id]: true,
    })
  }

  const closeNestedMenu = (id: string) => {
    setNestedMenusVisibility({
      ...nestedMenusVisibility,
      [id]: false,
    })
  }

  return (
    <Box flexDirection="column">
      {items.map((item, index) => {
        const isFocused = focused && index === selection
        const id = String(index)
        const isVisible = nestedMenusVisibility[id]

        return (
          <Box key={index} flexDirection="column">
            <TextButton
              selectKey={selectKey}
              isFocused={isFocused}
              onPress={
                item.items
                  ? () => openNestedMenu(id)
                  : item.onSelect || (() => null)
              }
            >
              {item.title} {item.items && (isVisible ? '▼' : '▶')}
            </TextButton>
            {item.items && isVisible && (
              <NestedMenu
                onReturn={() => closeNestedMenu(id)}
                isFocused={isVisible && focused}
                items={item.items}
              />
            )}
          </Box>
        )
      })}
    </Box>
  )
}
