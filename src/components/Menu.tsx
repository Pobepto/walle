import React, { useState } from 'react'
import { Box } from 'ink'
import { SelectionSettings, SuperKey, useKey } from '@hooks'
import { TextButton } from './TextButton'
import { Selection, SelectionZone } from './SelectionZone'

interface MenuItem {
  title: React.ReactNode
  items?: SubMenuItem[]
  onSelect?: () => void
}

type SubMenuItem = Omit<MenuItem, 'items'>

interface MenuProps extends Omit<SelectionSettings, 'amount'> {
  selectKey?: SuperKey | SuperKey[]
  items: MenuItem[]
}

interface PropsDrop {
  isActive: boolean
  items: SubMenuItem[]
  onReturn: () => void
}

const NestedMenu: React.FC<PropsDrop> = ({ isActive, onReturn, items }) => {
  useKey(['escape', 'leftArrow'], onReturn, isActive)

  return (
    <Box marginLeft={1}>
      <Menu
        items={items}
        isActive={isActive}
        prevKey="upArrow"
        nextKey="downArrow"
      />
    </Box>
  )
}

export const Menu: React.FC<MenuProps> = ({
  isActive = false,
  items,
  prevKey,
  nextKey,
  looped,
  selectKey = 'return',
}) => {
  const [nestedMenusVisibility, setNestedMenusVisibility] = useState<
    Record<string, boolean>
  >({})

  const anyNestedMenuIsVisible = Object.values(nestedMenusVisibility).some(
    Boolean,
  )

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
      <SelectionZone
        prevKey={prevKey}
        nextKey={nextKey}
        isActive={isActive && !anyNestedMenuIsVisible}
        looped={looped}
      >
        {items.map((item, index) => {
          const id = String(index)
          const isVisible = nestedMenusVisibility[id]

          return (
            <Box key={id} flexDirection="column">
              <Selection>
                {(isFocused) => (
                  <TextButton
                    selectKey={selectKey}
                    isFocused={isFocused || isVisible}
                    onPress={
                      item.items
                        ? () => openNestedMenu(id)
                        : item.onSelect || (() => null)
                    }
                  >
                    {item.title} {item.items && (isVisible ? '▼' : '▶')}
                  </TextButton>
                )}
              </Selection>
              {item.items && isVisible && (
                <NestedMenu
                  onReturn={() => closeNestedMenu(id)}
                  isActive={isActive}
                  items={item.items}
                />
              )}
            </Box>
          )
        })}
      </SelectionZone>
    </Box>
  )
}
