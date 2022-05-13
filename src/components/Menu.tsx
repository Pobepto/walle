import React from 'react'
import { Box, Key } from 'ink'
import { useSelection } from '../hooks'
import { TextButton } from './TextButton'

interface MenuItem {
  title: React.ReactNode,
  onSelect: () => void;
}

interface Props {
  focused: boolean,
  prevKey?: keyof Key;
  nextKey?: keyof Key;
  selectKey?: keyof Key;
  items: MenuItem[];
}

export const Menu: React.FC<Props> = ({
  focused,
  items,
  prevKey = 'leftArrow',
  nextKey = 'rightArrow',
  selectKey = 'return'
}) => {
  const [selection] = useSelection(items.length, prevKey, nextKey, focused)

  return (
    <Box flexDirection='column'>
      {items.map((item, index) => (
        <TextButton
          key={index}
          selectKey={selectKey}
          isFocused={focused && index === selection}
          onPress={item.onSelect}
        >
          {item.title}
        </TextButton>
      ))}
    </Box>
  )
}
