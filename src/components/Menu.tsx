import React, { useState } from 'react'
import { Box, Key } from 'ink'
import { useKey, useSelection } from '../hooks'
import { TextButton } from './TextButton'

interface MenuItem {
  title: React.ReactNode
  items?: SubMenuItem[]
  onSelect: () => void
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

const Dropdown: React.FC<PropsDrop> = ({ isFocused, onReturn, items }) => {
  useKey('escape', () => onReturn(), isFocused)

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
  focused,
  looped,
  items,
  prevKey = 'leftArrow',
  nextKey = 'rightArrow',
  selectKey = 'return',
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [selection] = useSelection(
    items.length,
    prevKey,
    nextKey,
    focused && !dropdownVisible,
    looped,
  )

  return (
    <Box flexDirection="column">
      {items.map((item, index) => {
        const isFocused = focused && index === selection

        return (
          <Box key={index} flexDirection="column">
            <TextButton
              selectKey={selectKey}
              isFocused={isFocused}
              onPress={
                item.items ? () => setDropdownVisible(true) : item.onSelect
              }
            >
              {item.title} {item.items && (dropdownVisible ? '▼' : '▶')}
            </TextButton>
            {item.items && dropdownVisible && (
              <Dropdown
                onReturn={() => setDropdownVisible(false)}
                isFocused={dropdownVisible}
                items={item.items}
              />
            )}
          </Box>
        )
      })}
    </Box>
  )
}
