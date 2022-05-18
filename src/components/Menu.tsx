import React, { useState } from 'react'
import { Box, Key } from 'ink'
import { useKey, useSelection } from '../hooks'
import { TextButton } from './TextButton'

interface SubMenuItem {
  id: number
  title: React.ReactNode
  onSelect: () => void
}

interface MenuItem {
  id: number
  title: React.ReactNode
  items?: SubMenuItem[]
  onSelect: () => void
}

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
  children: React.ReactNode
  openKey: keyof Key
}

const Dropdown: React.FC<PropsDrop> = ({ isFocused, openKey, children }) => {
  const [visible, setVisible] = useState(false)

  useKey(openKey, () => setVisible((state) => !state), isFocused)

  if (!visible) return null

  return <Box marginLeft={1}>{children}</Box>
}

export const Menu: React.FC<Props> = ({
  focused,
  looped,
  items,
  prevKey = 'leftArrow',
  nextKey = 'rightArrow',
  selectKey = 'return',
}) => {
  const menuLength = items.reduce((total, item) => {
    const subItems = item.items ? item.items.length : 0
    const size = 1 + subItems
    return total + size
  }, 0)
  const [selection] = useSelection(
    menuLength,
    prevKey,
    nextKey,
    focused,
    looped,
  )

  return (
    <Box flexDirection="column">
      {items.map((item) => {
        return (
          <Box key={item.id} flexDirection="column">
            <TextButton
              selectKey={selectKey}
              isFocused={focused && item.id === selection}
              onPress={item.onSelect}
            >
              {item.title}
              {/* {item.items && (focused ? '▼' : '▶')} */}
            </TextButton>
            {item.items && (
              <Dropdown
                openKey={selectKey}
                isFocused={focused && item.id === selection}
              >
                <Menu items={item.items} />
              </Dropdown>
            )}
          </Box>
        )
      })}
    </Box>
  )
}
