import React, { useState } from 'react'
import { Box, Key } from 'ink'
import { useKey, useSelection } from '../hooks'
import { TextButton } from './TextButton'

interface MenuItem {
  title: React.ReactNode
  items?: MenuItem[]
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
  const [selection] = useSelection(
    items.length,
    prevKey,
    nextKey,
    focused,
    looped,
  )

  return (
    <Box flexDirection="column">
      {items.map((item, index) => {
        return (
          <Box key={index} flexDirection="column">
            <TextButton
              selectKey={selectKey}
              isFocused={focused && index === selection}
              onPress={item.onSelect}
            >
              {item.title}
              {/* {item.items && (focused ? '▼' : '▶')} */}
            </TextButton>
            {item.items && (
              <Dropdown
                openKey={selectKey}
                isFocused={focused && index === selection}
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
