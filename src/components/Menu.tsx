import React, { useState } from 'react'
import { Text, Box } from 'ink'
import { useInput } from '../hooks/useInput'

interface Props {
  focused: boolean,
  items: {
    title: string,
    onSelect: () => void;
  }[];
}

export const Menu: React.FC<Props> = ({ focused, items }) => {
  const [selectedIndex, setIndex] = useState(0)

  useInput(key => {
    if (key.upArrow) {
      setIndex(i => i === 0 ? items.length - 1 : i - 1)
    } else if (key.downArrow) {
      setIndex(i => i === items.length - 1 ? 0 : i + 1)
    }

    if (key.return) {
      const item = items[selectedIndex]

      item.onSelect && item.onSelect()
    }
  }, focused)

  return (
    <Box flexDirection='column'>
      {items.map((item, index) => (
        <Text
          key={index}
          bold={index === selectedIndex}
        >
          {item.title}
        </Text>
      ))}
    </Box>
  )
}
