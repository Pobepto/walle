import React from 'react'
import { Box, Key } from 'ink'
import { useSelection } from '../hooks/useSelection'
import { Button } from './Button'

interface MenuItem {
  title: string,
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
  const selection = useSelection(items.length, prevKey, nextKey, focused)

  return (
    <Box flexDirection='column'>
      {items.map((item, index) => (
        <Button
          key={index}
          keyType={selectKey}
          isFocused={index === selection}
          onPress={item.onSelect}
        >
          {item.title}
        </Button>
      ))}
    </Box>
  )
}
